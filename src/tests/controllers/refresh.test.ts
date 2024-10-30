import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../server";

describe("Tests E2E for Refresh Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível receber um novo token, ao enviarmos um refresh token por um cookie", async () => {
    await request(app.server).post("/users").send({
      name: "Thiago Santos",
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const auth = await request(app.server).post("/authenticate").send({
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const cookie = auth.get("Set-Cookie") || [];

    const response = await request(app.server).patch("/token/refresh").set("Cookie", cookie).send();

    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([expect.stringContaining("refreshToken=")]);
  });
});
