import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../server";

describe("Tests E2E for Authenticate Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível autenticar um usuário", async () => {
    await request(app.server).post("/users").send({
      name: "Thiago Santos",
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const response = await request(app.server).post("/authenticate").send({
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
