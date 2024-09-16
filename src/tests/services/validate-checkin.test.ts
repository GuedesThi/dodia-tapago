import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { ValidateCheckinService } from "../../services/validate-checkin";
import { ResourceNotFoundError } from "../../services/erros/resource-not-found";
import { LateCheckinValidationError } from "../../services/erros/late-checkin-validation";

let inMemory: InMemoryCheckInRepository;
let validateService: ValidateCheckinService;

describe("Test for Validate Checkin Service", () => {
  beforeEach(async () => {
    inMemory = new InMemoryCheckInRepository();
    validateService = new ValidateCheckinService(inMemory);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Deve ser possível validar um check-in", async () => {
    const criandoCheckin = await inMemory.create({
      gym_id: "1",
      user_id: "1",
      created_at: new Date(),
    });

    const { checkin } = await validateService.execute({
      checkinId: criandoCheckin.id,
    });

    expect(checkin.validated_at).toEqual(expect.any(Date));
    expect(inMemory.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("Não deve ser possível validar um check-in que não existe", async () => {
    await expect(
      validateService.execute({
        checkinId: "qualquer valor",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Não deve ser possível validar um check-in após 20 minutos dele ser criado", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40));

    const criandoCheckin = await inMemory.create({
      gym_id: "1",
      user_id: "1",
      created_at: new Date(),
    });

    const vinteUmMinutosEmMilissegundos = 1000 * 60 * 21;

    vi.advanceTimersByTime(vinteUmMinutosEmMilissegundos);

    await expect(
      validateService.execute({
        checkinId: criandoCheckin.id,
      })
    ).rejects.toBeInstanceOf(LateCheckinValidationError);
  });
});
