import { CheckInsRepository } from "../repositories/checkinsRepository";

interface GetUserMetricsRequest {
  userId: string;
}

interface GetUserMetricsResponse {
  checkinsCount: number;
}

export class GetUserMetrics {
  private checkinRepository: CheckInsRepository;

  constructor(checkinRepository: CheckInsRepository) {
    this.checkinRepository = checkinRepository;
  }

  async execute({ userId }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkinsCount = await this.checkinRepository.countByUserId(userId);

    return { checkinsCount };
  }
}