import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { PrismaGymRepository } from "../../repositories/prisma/prisma-gym-repository";
import { GymService } from "../gymService";

export function GymFactory(db: string) {
  const prismaRepository = new PrismaGymRepository();
  const inMemoryRepository = new InMemoryGymRepository();

  if (db === "prisma") {
    return new GymService(prismaRepository);
  } else if (db === "in-memory") {
    return new GymService(inMemoryRepository);
  }

  return new GymService(inMemoryRepository);
}
