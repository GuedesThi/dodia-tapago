import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { GymFactory } from "../../services/factories/gym-factory";

export async function createGymController(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((lat) => {
      return Math.abs(lat) <= 90;
    }),
    longitude: z.number().refine((lat) => {
      return Math.abs(lat) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body);

  const gymService = GymFactory("prisma");
  await gymService.execute({ title, description, phone, latitude, longitude });

  return reply.status(201).send();
}
