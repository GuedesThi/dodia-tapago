import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { InMemoryGymRepository } from "../../repositories/in-memory/inMemoryGymRepository";
import { PrismaCheckinRepository } from "../../repositories/prisma/prisma-checkin-repository";
import { PrismaGymRepository } from "../../repositories/prisma/prisma-gym-repository";
import { CheckinService } from "../checkinService";

export function CheckinFactory(db: string) {
  const prismaRepository = new PrismaCheckinRepository();
  const inMemoryRepository = new InMemoryCheckInRepository();

  const gymPrismaRepository = new PrismaGymRepository();
  const gymInMemoryRepository = new InMemoryGymRepository();

  if (db === "prisma") {
    return new CheckinService(prismaRepository, gymPrismaRepository);
  } else if (db === "in-memory") {
    return new CheckinService(inMemoryRepository, gymInMemoryRepository);
  }

  return new CheckinService(inMemoryRepository, gymInMemoryRepository);
}
