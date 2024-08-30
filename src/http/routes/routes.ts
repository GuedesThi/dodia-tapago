import { registerController } from "../controllers/registerController";
import { FastifyInstance } from "fastify";

export async function routes(app: FastifyInstance) {
  app.post("/users", registerController);
}
