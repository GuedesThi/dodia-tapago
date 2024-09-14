import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { CheckinService } from "../../services/checkinService";
import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckinsError } from "../../services/erros/max-number-of-checkins";
import { MaxDistanceError } from "../../services/erros/max-distance-error";

let inMemory: InMemoryCheckInRepository;
let checkInService: CheckinService;
let gymInMemory: InMemoryGymRepository;

describe("Test for Checkin Service", () => {
  beforeEach(async () => {
    inMemory = new InMemoryCheckInRepository();
    gymInMemory = new InMemoryGymRepository();
    checkInService = new CheckinService(inMemory, gymInMemory);

    await gymInMemory.create({
      id: "1",
      title: "Smart Fit",
      description: "",
      phone: "",
      latitude: new Decimal(-22.8130816),
      longitude: new Decimal(-43.4241536),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Deve ser possível criar um check-in", async () => {
    const { checkin } = await checkInService.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -22.8130816,
      userLongitude: -43.4241536,
    });

    expect(checkin).toEqual(expect.any(Object));
  });

  it("Usuário não deve conseguir realizar 2 check-ins no mesmo dia", async () => {
    await checkInService.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -22.8130816,
      userLongitude: -43.4241536,
    });

    await expect(
      checkInService.execute({
        userId: "1",
        gymId: "1",
        userLatitude: -22.8130816,
        userLongitude: -43.4241536,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError);
  });

  it("Usuário deve poder fazer dois check-ins, mas, em diferentes dias", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await checkInService.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -22.8130816,
      userLongitude: -43.4241536,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkin } = await checkInService.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -22.8130816,
      userLongitude: -43.4241536,
    });

    expect(checkin).toEqual(expect.any(Object));
  });

  it("Usuário não pode fazer check-in se exceder a distância máxima (atualmente: 100m) da academia", async () => {
    gymInMemory.items.push({
      id: "2",
      title: "Smart Fit Mesquita",
      description: "",
      phone: "",
      latitude: new Decimal(-22.784155),
      longitude: new Decimal(-43.4307615),
    });

    await expect(
      checkInService.execute({
        userId: "1",
        gymId: "2",
        userLatitude: -22.8130816,
        userLongitude: -43.4241536,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
