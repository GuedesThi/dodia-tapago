import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { PrismaGymRepository } from "../../repositories/prisma/prisma-gym-repository";
import { SearchGymsService } from "../search-gyms";

export function SearchGymsFactory(db: string) {
  const prismaRepository = new PrismaGymRepository();
  const inMemoryRepository = new InMemoryGymRepository();

  if (db === "prisma") {
    return new SearchGymsService(prismaRepository);
  } else if (db === "in-memory") {
    return new SearchGymsService(inMemoryRepository);
  }

  return new SearchGymsService(inMemoryRepository);
}
