import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { SearchGymsService } from "../../services/search-gyms";

let inMemory: InMemoryGymRepository;
let searchService: SearchGymsService;

describe("Test for Search Gyms Service", () => {
  beforeEach(() => {
    inMemory = new InMemoryGymRepository();
    searchService = new SearchGymsService(inMemory);
  });

  it("Usuário deve poder encontrar academias pelo nome", async () => {
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

    const { gyms } = await searchService.execute({
      query: "Smart-Fit",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Smart-Fit" })]);
  });

  it("Deve ser possível escolher a página das academias criadas (no máximo 20 itens por página)", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemory.create({
        title: "Smart-Fit",
        description: "A sua acadêmia inteligente.",
        phone: "(+55) 2196968-3603",
        latitude: -22.8130816,
        longitude: -43.4241536,
      });
    }

    const { gyms } = await searchService.execute({
      query: "Smart-Fit",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Smart-Fit" }),
      expect.objectContaining({ title: "Smart-Fit" }),
    ]);
  });
});
