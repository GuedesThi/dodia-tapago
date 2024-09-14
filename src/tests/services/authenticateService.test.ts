import { expect, describe, it } from "vitest";
import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { AuthenticateService } from "../../services/authenticateService";
import { InvalidCredentialsError } from "../../services/erros/invalid-credentials";
import { hash } from "bcryptjs";

describe("Test for Authenticate", () => {
  it("Um usuário deve conseguir se autenticar", async () => {
    const inMemory = new InMemoryUserRepository();

    await inMemory.create({
      name: "Thiago Guedes",
      email: "thiagoguedes@gmail.com",
      password_hash: await hash("@Thiago21", 6),
    });

    const authenticateService = new AuthenticateService(inMemory);

    const login = { email: "thiagoguedes@gmail.com", password: "@Thiago21" };

    expect(await authenticateService.execute(login)).toEqual(
      expect.any(Object)
    );
  });

  it("Um usuário não pode se autenticar com um email não cadastrado", async () => {
    const inMemory = new InMemoryUserRepository();
    const authenticateService = new AuthenticateService(inMemory);

    await expect(
      authenticateService.execute({
        email: "thiagoguedes@gmail.com",
        password: "@Thiago21",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Um usuário não pode se autenticar com uma senha inválida", async () => {
    const inMemory = new InMemoryUserRepository();

    await inMemory.create({
      name: "Thiago Guedes",
      email: "thiagoguedes@gmail.com",
      password_hash: await hash("@Thiago21", 6),
    });

    const authenticateService = new AuthenticateService(inMemory);

    await expect(
      authenticateService.execute({
        email: "thiagoguedes@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
