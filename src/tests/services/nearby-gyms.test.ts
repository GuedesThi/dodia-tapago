import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { NearbyhGymsService } from "../../services/nearby-gyms";

let inMemory: InMemoryGymRepository;
let nearbyService: NearbyhGymsService;

describe("Test for Nearby Gyms Service", () => {
  beforeEach(() => {
    inMemory = new InMemoryGymRepository();
    nearbyService = new NearbyhGymsService(inMemory);
  });

  it("Usuário deve poder encontrar academias próximas (1km) dele", async () => {
    await inMemory.create({
      title: "Smart-Fit",
      description: "A sua acadêmia inteligente.",
      phone: "(+55) 2196968-3603",
      latitude: -22.8130816,
      longitude: -43.4241536,
    });

    await inMemory.create({
      title: "Blue Fit",
      description: "Mais azul pra sua saúde.",
      phone: "(+55) 2198369-2012",
      latitude: -22.8093224,
      longitude: -43.4175239,
    });

    const { gyms } = await nearbyService.execute({
      userLatitude: -22.8095474,
      userLongitude: -43.4180175,
    });

    expect(gyms).toHaveLength(2);
  });
});
