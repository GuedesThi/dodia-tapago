import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../server";

describe("Tests E2E for Profile Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível pegar os dados da conta de um usuário", async () => {
    await request(app.server).post("/users").send({
      name: "Thiago Santos",
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const auth = await request(app.server).post("/authenticate").send({
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const { token } = auth.body;

    const profile = await request(app.server)
      .get("/me")
      .set("Authorization", "Bearer " + token)
      .send();

    expect(profile.statusCode).toEqual(200);
    expect(profile.body.user).toEqual(
      expect.objectContaining({
        email: "thiagosantos@gmail.com",
        name: "Thiago Santos",
      })
    );
  });
});
