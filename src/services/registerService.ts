import { UserRepository } from "src/repositories/userRepository";
import { prisma } from "../server";
import { hash } from "bcryptjs";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  public userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async run({ name, email, password, }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.userRepository.findByEmail(email);
  
    if (userWithSameEmail) {
      throw new Error("Esse email já existe em nosso sistema");
    }
  
    await this.userRepository.create({name, email, password_hash});
  
  }
}
