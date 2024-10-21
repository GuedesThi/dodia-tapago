import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app, prisma } from "../../server";

describe("Tests E2E for Validate Checkin Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível validar um check-in", async () => {
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

    const gym = await prisma.gym.create({
      data: {
        title: "Smart-Fit",
        description: "Sua academia inteligente",
        phone: "(+55) 21 96968-3603",
        latitude: -22.8130816,
        longitude: -43.4241536,
      },
    });

    const checkin = await request(app.server)
      .post(`/gyms/${gym.id}/checkin`)
      .set("Authorization", "Bearer " + token)
      .send({
        userLatitude: -22.8130816,
        userLongitude: -43.4241536,
      });

    const response = await request(app.server)
      .put(`/checkin/${checkin.body.checkin.id}/validate`)
      .set("Authorization", "Bearer " + token)
      .send();

    expect(response.statusCode).toEqual(204);
  });
});
