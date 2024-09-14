import { UserRepository } from "../repositories/userRepository";
import { UserAlreadyExistsError } from "./erros/user-already-exists";
import bcryptjs from 'bcryptjs';

const { hash } = bcryptjs;

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
      throw new UserAlreadyExistsError();
    }
  
    const user = await this.userRepository.create({name, email, password_hash});

    return user;
  
  }
}
