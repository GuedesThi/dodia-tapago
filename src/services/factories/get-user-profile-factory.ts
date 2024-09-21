import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { PrismaUserRepository } from "../../repositories/prisma/prismaUserRepository";
import { GetUserProfileService } from "../get-user-profileService";

export function GetUserProfileFactory(db: string) {
  const prismaRepository = new PrismaUserRepository();
  const inMemoryRepository = new InMemoryUserRepository();

  if (db === "prisma") {
    return new GetUserProfileService(prismaRepository);
  } else if (db === "in-memory") {
    return new GetUserProfileService(inMemoryRepository);
  }

  return new GetUserProfileService(inMemoryRepository);
}
