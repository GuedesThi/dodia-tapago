import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../userRepository";

export class InMemoryUserRepository implements UserRepository {
  public database: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.database.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.database.find((i) => i.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    const user = this.database.find((i) => i.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
