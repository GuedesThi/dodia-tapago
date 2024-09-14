import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { GymService } from "../../services/gymService";

let inMemory: InMemoryGymRepository;
let gymService: GymService;

describe("Test for Gym Service", () => {
  beforeEach(() => {
    inMemory = new InMemoryGymRepository();
    gymService = new GymService(inMemory);
  });

  it("Usuário deve poder criar uma academia", async () => {
    const { gym } = await gymService.execute({
      title: "Smart-Fit",
      description: "A sua acadêmia inteligente.",
      phone: "(+55) 2196968-3603",
      latitude: -22.8130816,
      longitude: -43.4241536,
    });

    expect(gym).toEqual(expect.any(Object));
  });
});
