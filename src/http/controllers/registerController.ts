import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../services/erros/user-already-exists";
import { registerFactory } from "../../services/factories/registerFactory";

// Objetivo: cadastrar usuários no banco de dados, com dados enviados por requisições do path "/users";
export async function registerController(request: FastifyRequest, reply: FastifyReply) {

  // Formato de dados esperados pela requisição;
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Dados enviados pela requisição;
  const { name, email, password } = registerBodySchema.parse(request.body);

  // Usa o service para cadastrar o usuário no banco, para isso envia o repository por parâmetro (Injeção de Dependência);
  try {
    const registerService = registerFactory("prisma");

    await registerService.run({name, email, password});
  
  // Se o service retorna um "409" é porque o email enviado já existe no banco de dados;
  } catch (error) {

    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error

  }

  // Se tudo der certo retorna um "201" de criado;
  return reply.status(201).send();
}
