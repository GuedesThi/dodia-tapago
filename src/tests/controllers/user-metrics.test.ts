import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app, prisma } from "../../server";

describe("Tests E2E for Checkins Metrics Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível buscar o número total de check-ins feitos", async () => {
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

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Smart-Fit",
        description: "Sua academia inteligente",
        phone: "(+55) 21 96968-3603",
        latitude: -22.8130816,
        longitude: -43.4241536,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const checkins = await request(app.server)
      .get("/checkin/metrics")
      .set("Authorization", "Bearer " + token)
      .send();

    expect(checkins.statusCode).toEqual(200);
    expect(checkins.body.checkinsCount).toEqual(2);
  });
});
