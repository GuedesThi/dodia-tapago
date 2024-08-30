import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUserRepository } from "src/repositories/prismaUserRepository";
import { RegisterService } from "src/services/registerService";
import { z } from "zod";

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
    const userRepository = new PrismaUserRepository();
    const registerService = new RegisterService(userRepository);

    await registerService.run({name, email, password});
  
  // Se o service retorna um "409" é porque o email enviado já existe no banco de dados;
  } catch (error) {
    return reply.status(409).send("O email informado já existe no sistema");
  }

  // Se tudo der certo retorna um "201" de criado;
  return reply.status(201).send();
}
