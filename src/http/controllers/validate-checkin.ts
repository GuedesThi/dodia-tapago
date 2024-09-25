import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ValidateCheckinFactory } from "../../services/factories/validate-checkin-factory";

export async function validateCheckinController(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamsSchema = z.object({
    checkinId: z.string().uuid(),
  });

  const { checkinId } = validateCheckinParamsSchema.parse(request.params);

  const validateService = ValidateCheckinFactory("prisma");

  await validateService.execute({ checkinId });

  return reply.status(204).send();
}
