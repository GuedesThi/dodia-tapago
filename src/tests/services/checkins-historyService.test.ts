import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { CheckinsHistoryService } from "../../services/checkins-historyService";

let inMemory: InMemoryCheckInRepository;
let historyService: CheckinsHistoryService;

describe("Test for History Checkins Service", () => {
  beforeEach(() => {
    inMemory = new InMemoryCheckInRepository();
    historyService = new CheckinsHistoryService(inMemory);
  });

  it("Deve ser possível pegar o histório dos check-ins criados", async () => {
    await inMemory.create({
      user_id: "1",
      gym_id: "1",
    });

    await inMemory.create({
      user_id: "1",
      gym_id: "2",
    });

    const { checkins } = await historyService.execute({
      userId: "1",
      page: 1,
    });

    expect(checkins).toHaveLength(2);
    expect(checkins).toEqual([
      expect.objectContaining({ gym_id: "1" }),
      expect.objectContaining({ gym_id: "2" }),
    ]);
  });

  it("Deve ser possível pegar o histório dos check-ins criados, com no máximo 20 itens por página", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemory.create({
        user_id: "1",
        gym_id: `${i}`,
      });
    }

    const { checkins } = await historyService.execute({
      userId: "1",
      page: 2,
    });

    expect(checkins).toHaveLength(2);
    expect(checkins).toEqual([
      expect.objectContaining({ gym_id: "21" }),
      expect.objectContaining({ gym_id: "22" }),
    ]);
  });
});
