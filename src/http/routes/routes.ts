import { authenticateController } from "../controllers/authenticateController";
import { profileController } from "../controllers/profile";
import { registerController } from "../controllers/registerController";
import { FastifyInstance } from "fastify";
import { verifyJWT } from "../verify-jwt";
import { createGymController } from "../controllers/create-gym";
import { searchGymsController } from "../controllers/search-gyms";
import { nearbyGymsController } from "../controllers/nearby-gyms";
import { createCheckinController } from "../controllers/create-checkin";
import { validateCheckinController } from "../controllers/validate-checkin";
import { checkinsHistoryController } from "../controllers/checkins-history";
import { userMetricsController } from "../controllers/user-metrics";

export async function routes(app: FastifyInstance) {
  // Rotas para User <Usuário não precisa estar autenticado>
  app.post("/users", registerController);
  app.post("/authenticate", authenticateController);

  // Rotas para User <Usuário deve estar autenticado>
  app.get("/me", { onRequest: [verifyJWT] }, profileController);

  // Rotas para Gym <Usuário deve estar autenticado>
  app.post("/gyms", { onRequest: [verifyJWT] }, createGymController);
  app.get("/gyms/search", { onRequest: [verifyJWT] }, searchGymsController);
  app.get("/gyms/nearby", { onRequest: [verifyJWT] }, nearbyGymsController);

  // Rotas para CheckIn <Usuário deve estar autenticado>
  app.post("/gyms/:gymId/checkin", { onRequest: [verifyJWT] }, createCheckinController);
  app.put("/checkin/:checkinId/validate", { onRequest: [verifyJWT] }, validateCheckinController);
  app.get("/checkin/history", { onRequest: [verifyJWT] }, checkinsHistoryController);
  app.get("/checkin/metrics", { onRequest: [verifyJWT] }, userMetricsController);
}
