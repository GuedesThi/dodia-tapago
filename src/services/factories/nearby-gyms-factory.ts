import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { PrismaGymRepository } from "../../repositories/prisma/prisma-gym-repository";
import { NearbyhGymsService } from "../nearby-gyms";

export function NearbyGymsFactory(db: string) {
  const prismaRepository = new PrismaGymRepository();
  const inMemoryRepository = new InMemoryGymRepository();

  if (db === "prisma") {
    return new NearbyhGymsService(prismaRepository);
  } else if (db === "in-memory") {
    return new NearbyhGymsService(inMemoryRepository);
  }

  return new NearbyhGymsService(inMemoryRepository);
}
