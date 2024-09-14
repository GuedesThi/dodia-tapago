import { expect, describe, it } from "vitest";
import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { GetUserProfileService } from "../../services/get-user-profileService";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "../../services/erros/resource-not-found";

describe("Test for Get User Profile", () => {
  it("Um usuário deve conseguir acessar os dados de um perfil logado", async () => {
    const inMemory = new InMemoryUserRepository();

    const user = await inMemory.create({
      name: "Thiago Guedes",
      email: "thiagoguedes@gmail.com",
      password_hash: await hash("@Thiago21", 6),
    });

    const getUserProfile = new GetUserProfileService(inMemory);

    expect(
      getUserProfile.execute({
        userId: user.id,
      })
    ).toEqual(expect.any(Object));
  });

  it("Um usuário não deve conseguir acessar os dados de um perfil com um id inválido", async () => {
    const inMemory = new InMemoryUserRepository();

    const user = await inMemory.create({
      name: "Thiago Guedes",
      email: "thiagoguedes@gmail.com",
      password_hash: await hash("@Thiago21", 6),
    });

    const getUserProfile = new GetUserProfileService(inMemory);

    await expect(
      getUserProfile.execute({
        userId: "123456",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
