import { authenticateController } from "../controllers/authenticateController";
import { profileController } from "../controllers/profile";
import { registerController } from "../controllers/registerController";
import { FastifyInstance } from "fastify";
import { verifyJWT } from "../verify-jwt";

export async function routes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.post("/authenticate", authenticateController);

  // Usuário Autenticado
  app.get("/me", { onRequest: [verifyJWT] }, profileController);
}
