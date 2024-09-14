import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { PrismaUserRepository } from "../../repositories/prisma/prismaUserRepository";
import { RegisterService } from "../registerService";

export function registerFactory(db: string) {
  const prismaRepository = new PrismaUserRepository();
  const inMemoryRepository = new InMemoryUserRepository();

  if (db === "prisma") {
    return new RegisterService(prismaRepository);
  } else if (db === "in-memory") {
    return new RegisterService(inMemoryRepository);
  }

  return new RegisterService(inMemoryRepository);
}
