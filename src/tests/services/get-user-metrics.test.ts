import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { GetUserMetrics } from "../../services/get-user-metrics";

let inMemory: InMemoryCheckInRepository;
let userMetrics: GetUserMetrics;

describe("Test for User Metrics", () => {
  beforeEach(() => {
    inMemory = new InMemoryCheckInRepository();
    userMetrics = new GetUserMetrics(inMemory);
  });

  it("Deve ser possível pegar o número total de check-ins feitos", async () => {
    await inMemory.create({
      user_id: "1",
      gym_id: "1",
    });

    await inMemory.create({
      user_id: "1",
      gym_id: "2",
    });

    await inMemory.create({
      user_id: "1",
      gym_id: "3",
    });

    const { checkinsCount } = await userMetrics.execute({
      userId: "1",
    });

    expect(checkinsCount).toBe(3);
  });
});
