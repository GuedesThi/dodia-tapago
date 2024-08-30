import { PrismaClient } from "@prisma/client";
import { fastify } from "fastify";
import { env } from "./env";
import { routes } from "./http/routes/routes";

export const app = fastify();

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});

app.register(routes);

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("⚙🔥Server's running...");
  });
