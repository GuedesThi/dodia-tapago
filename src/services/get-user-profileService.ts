import { User } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository";
import { ResourceNotFoundError } from "./erros/resource-not-found";

interface GetUserProfileRequest {
  userId: string;
}

interface GetUserProfileResponse {
  user: User;
}

export class GetUserProfileService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute({ userId }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return { user };

    }

}
