import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserProfileFactory } from "../../services/factories/get-user-profile-factory";

export async function profileController(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = GetUserProfileFactory("prisma");

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
