import { FastifyRequest, FastifyReply } from "fastify";
import { GetUserMetricsFactory } from "../../services/factories/get-user-metrics-factory";

export async function userMetricsController(request: FastifyRequest, reply: FastifyReply) {
  const metricsService = GetUserMetricsFactory("prisma");
  const { checkinsCount } = await metricsService.execute({ userId: request.user.sub });

  return reply.status(200).send({ checkinsCount });
}
