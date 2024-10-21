import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { NearbyGymsFactory } from "../../services/factories/nearby-gyms-factory";

export async function nearbyGymsController(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((lat) => {
      return Math.abs(lat) <= 90;
    }),
    userLongitude: z.coerce.number().refine((lat) => {
      return Math.abs(lat) <= 180;
    }),
  });

  const { userLatitude, userLongitude } = nearbyGymsQuerySchema.parse(request.query);

  const nearbyService = NearbyGymsFactory("prisma");
  const { gyms } = await nearbyService.execute({ userLatitude, userLongitude });

  return reply.status(200).send({ gyms });
}
