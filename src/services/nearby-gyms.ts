import { Gym } from "@prisma/client";
import { GymRepository } from "../repositories/gymRepository";

interface NearbyhGymsRequest {
    userLatitude: number;
    userLongitude: number;
}

interface NearbyhGymsResponse {
  gyms: Gym[];
}

export class NearbyhGymsService {
  private gymRepository: GymRepository;

  constructor(gymRepository: GymRepository) {
    this.gymRepository = gymRepository;
  }

  async execute({ userLatitude, userLongitude }: NearbyhGymsRequest): Promise<NearbyhGymsResponse> {
    const gyms = await this.gymRepository.findManyNearby(userLatitude, userLongitude);

    return { gyms };
  }
}
