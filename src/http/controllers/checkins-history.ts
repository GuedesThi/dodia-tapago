import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { CheckinHistoryFactory } from "../../services/factories/checkin-history-factory";

export async function checkinsHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const checkinsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkinsHistoryQuerySchema.parse(request.query);

  const historyService = CheckinHistoryFactory("prisma");
  const { checkins } = await historyService.execute({ userId: request.user.sub, page });

  return reply.status(200).send({ checkins });
}
