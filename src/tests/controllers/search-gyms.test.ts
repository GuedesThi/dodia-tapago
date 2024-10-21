import { expect, describe, it, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../server";

describe("Tests E2E for Search Gyms Controller", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it("Deve ser possível buscar academias", async () => {
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

    await request(app.server)
      .post("/gyms")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Smart-Fit",
        description: "Sua academia inteligente",
        phone: "(+55) 21 96968-3603",
        latitude: -22.8130816,
        longitude: -43.4241536,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Blue Fit",
        description: "Sua saúde mais blue",
        phone: "(+55) 21 98108-2012",
        latitude: -22.8130816,
        longitude: -43.4241536,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Smart",
      })
      .set("Authorization", "Bearer " + token)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Smart-Fit",
      }),
    ]);
  });
});
