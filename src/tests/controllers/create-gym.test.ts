import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app, prisma } from "../../server";
import { hash } from "bcryptjs";

describe("Tests E2E for Create Gym Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível criar uma academia", async () => {
    await prisma.user.create({
      data: {
        name: "Thiago Guedes",
        email: "thiagosantos@gmail.com",
        password_hash: await hash("123456", 6),
        role: "ADMIN",
      },
    });

    const auth = await request(app.server).post("/authenticate").send({
      email: "thiagosantos@gmail.com",
      password: "123456",
    });

    const { token } = auth.body;

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Smart-Fit",
        description: "Sua academia inteligente",
        phone: "(+55) 21 96968-3603",
        latitude: -22.8130816,
        longitude: -43.4241536,
      });

    expect(response.statusCode).toEqual(201);
  });
});
