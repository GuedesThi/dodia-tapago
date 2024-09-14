import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/checkinsRepository";

interface CheckinsHistoryRequest {
  userId: string;
  page: number;
}

interface CheckinsHistoryResponse {
  checkins: CheckIn[];
}

export class CheckinsHistoryService {
  private checkinRepository: CheckInsRepository;

  constructor(checkinRepository: CheckInsRepository) {
    this.checkinRepository = checkinRepository;
  }

  async execute({ userId, page }: CheckinsHistoryRequest): Promise<CheckinsHistoryResponse> {
    const checkins = await this.checkinRepository.findManyByUserId(
      userId,
      page
    );

    return { checkins };
  }
}
