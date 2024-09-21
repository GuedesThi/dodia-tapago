import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { PrismaCheckinRepository } from "../../repositories/prisma/prisma-checkin-repository";
import { ValidateCheckinService } from "../validate-checkin";

export function ValidateCheckinFactory(db: string) {
  const prismaRepository = new PrismaCheckinRepository();
  const inMemoryRepository = new InMemoryCheckInRepository();

  if (db === "prisma") {
    return new ValidateCheckinService(prismaRepository);
  } else if (db === "in-memory") {
    return new ValidateCheckinService(inMemoryRepository);
  }

  return new ValidateCheckinService(inMemoryRepository);
}
