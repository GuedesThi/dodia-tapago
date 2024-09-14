import { compare } from "bcryptjs";
import { expect, describe, it } from "vitest";
import { InMemoryUserRepository } from "../../repositories/in-memory/inMemoryUserRepository";
import { RegisterService } from "../../services/registerService";
import { UserAlreadyExistsError } from "../../services/erros/user-already-exists";

describe("Tests for registerService", () => {
  it("Um usuário deve conseguir se cadastrar", async () => {
    const inMemory = new InMemoryUserRepository();
    const registerService = new RegisterService(inMemory);

    const user = await registerService.run({
      name: "Fula Nu",
      email: "fulanu@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("A senha deve ser criptografada após um cadastro realizado", async () => {
    const inMemory = new InMemoryUserRepository();
    const registerService = new RegisterService(inMemory);

    const user = await registerService.run({
      name: "Fula Nu",
      email: "fulanu@gmail.com",
      password: "123456",
    });

    const comparandoSenhas = await compare("123456", user.password_hash);

    expect(comparandoSenhas).toBe(true);
  });

  it("Se cadastrar com um email já cadastrado deve dar erro", async () => {
    const inMemory = new InMemoryUserRepository();
    const registerService = new RegisterService(inMemory);

    const email = "fulanu@gmail.com";

    await registerService.run({
      name: "Fula Nu",
      email,
      password: "123456",
    });

    await expect(
      registerService.run({
        name: "Fula Nu",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
