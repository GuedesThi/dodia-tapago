import { Gym, Prisma } from "@prisma/client";
import { GymRepository } from "../gymRepository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "../../utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.items.find((i) => {
      return i.id === id;
    });

    if (!gym) {
      return null;
    }

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((i) => i.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    return this.items.filter((i) => {
      const distancia = getDistanceBetweenCoordinates(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: i.latitude.toNumber(), longitude: i.longitude.toNumber() }
      );

      return distancia < 1;
    });
  }
}
