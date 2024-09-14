import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "../../services/erros/invalid-credentials";
import { authenticateFactory } from "../../services/factories/authenticateFactory";

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = authenticateFactory("prisma");

    await authenticateService.execute({ email, password });

  } catch (error) {

    if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({ message: error.message });
    }

    throw error
    
  };

  // "200" de sucesso;
  return reply.status(200).send();

}
