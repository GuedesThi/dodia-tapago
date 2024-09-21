import { InMemoryCheckInRepository } from "../../repositories/in-memory/inMemoryCheckinRepository";
import { PrismaCheckinRepository } from "../../repositories/prisma/prisma-checkin-repository";
import { GetUserMetrics } from "../get-user-metrics";

export function GetUserMetricsFactory(db: string) {
  const prismaRepository = new PrismaCheckinRepository();
  const inMemoryRepository = new InMemoryCheckInRepository();

  if (db === "prisma") {
    return new GetUserMetrics(prismaRepository);
  } else if (db === "in-memory") {
    return new GetUserMetrics(inMemoryRepository);
  }

  return new GetUserMetrics(inMemoryRepository);
}
