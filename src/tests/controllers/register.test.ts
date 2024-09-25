import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../server";

describe("Tests E2E for Register Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível realizar um registro de usuário", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Thiago Santos",
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
