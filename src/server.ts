import { PrismaClient } from "@prisma/client";
import { fastify } from "fastify";
import { env } from "./env";
import { routes } from "./http/routes/routes";
import { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10min",
  },
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

app.register(routes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Erro de cadastro", issues: error.format() });
  } else if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(400).send({ message: "Internal server error" });
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("⚙🔥Server's running...");
  });
