import { UserRepository } from "../repositories/userRepository";
import { InvalidCredentialsError } from "./erros/invalid-credentials";
import { User } from "@prisma/client";
import bcryptjs from 'bcryptjs';

const { compare } = bcryptjs;

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
        throw new InvalidCredentialsError();
    }

    const asSenhasSaoIguais = await compare(password, user.password_hash);

    if (!asSenhasSaoIguais) {
        throw new InvalidCredentialsError();
    }

    return {user};

  }
}
