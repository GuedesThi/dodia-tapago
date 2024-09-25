import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { CheckinFactory } from "../../services/factories/checkin-factory";
import { ResourceNotFoundError } from "../../services/erros/resource-not-found";
import { MaxDistanceError } from "../../services/erros/max-distance-error";
import { MaxNumberOfCheckinsError } from "../../services/erros/max-number-of-checkins";

export async function createCheckinController(request: FastifyRequest, reply: FastifyReply) {
  const createCheckinParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckinBodySchema = z.object({
    userLatitude: z.number().refine((lat) => {
      return Math.abs(lat) <= 90;
    }),
    userLongitude: z.number().refine((lat) => {
      return Math.abs(lat) <= 180;
    }),
  });

  const { gymId } = createCheckinParamsSchema.parse(request.params);
  const { userLatitude, userLongitude } = createCheckinBodySchema.parse(request.body);

  const checkinService = CheckinFactory("prisma");

  try {
    const { checkin } = await checkinService.execute({
      userId: request.user.sub,
      gymId,
      userLatitude,
      userLongitude,
    });
    return reply.status(201).send({ checkin });
  } catch (error) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof MaxDistanceError ||
      error instanceof MaxNumberOfCheckinsError
    ) {
      return reply.status(400).send({ message: error.message });
    }
  }
}
