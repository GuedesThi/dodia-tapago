import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { PrismaUserRepository } from "../../repositories/prisma/prismaUserRepository";
import { AuthenticateService } from "../authenticateService";

export function authenticateFactory(db: string) {
  const prismaRepository = new PrismaUserRepository();
  const inMemoryRepository = new InMemoryUserRepository();

  if (db === "prisma") {
    return new AuthenticateService(prismaRepository);
  } else if (db === "in-memory") {
    return new AuthenticateService(inMemoryRepository);
  }

  return new AuthenticateService(inMemoryRepository);
}
