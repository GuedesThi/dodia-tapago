import { Gym } from "@prisma/client";
import { GymRepository } from "../repositories/gymRepository";

interface SearchGymsRequest {
    query: string;
    page: number;
}

interface SearchGymsResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  private gymRepository: GymRepository;

  constructor(gymRepository: GymRepository) {
    this.gymRepository = gymRepository;
  }

  async execute({ query, page }: SearchGymsRequest): Promise<SearchGymsResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
