import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { SearchGymsFactory } from "../../services/factories/search-gyms-factory";

export async function searchGymsController(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsQuerySchema.parse(request.query);

  const searchService = SearchGymsFactory("prisma");
  const { gyms } = await searchService.execute({ query, page });

  return reply.status(200).send({ gyms });
}
