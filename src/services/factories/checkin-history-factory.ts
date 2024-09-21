import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { PrismaCheckinRepository } from "../../repositories/prisma/prisma-checkin-repository";
import { CheckinsHistoryService } from "../checkins-historyService";

export function CheckinHistoryFactory(db: string) {
  const prismaRepository = new PrismaCheckinRepository();
  const inMemoryRepository = new InMemoryCheckInRepository();

  if (db === "prisma") {
    return new CheckinsHistoryService(prismaRepository);
  } else if (db === "in-memory") {
    return new CheckinsHistoryService(inMemoryRepository);
  }

  return new CheckinsHistoryService(inMemoryRepository);
}
