import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/checkinsRepository";
import { ResourceNotFoundError } from "./erros/resource-not-found";
import dayjs from "dayjs";
import { LateCheckinValidationError } from "./erros/late-checkin-validation";

interface ValidateCheckinRequest {
  checkinId: string;
}

interface ValidateCheckinResponse {
  checkin: CheckIn;
}

export class ValidateCheckinService {
  private checkinsRepository: CheckInsRepository;

  constructor(checkinsRepository: CheckInsRepository) {
    this.checkinsRepository = checkinsRepository;
  }

  async execute({ checkinId }: ValidateCheckinRequest): Promise<ValidateCheckinResponse> {
    const checkin = await this.checkinsRepository.findById(checkinId);

    if (!checkin) {
        throw new ResourceNotFoundError();
    }

    const diferencaEmMinutoDoCheckinCriadoParaAgora = dayjs(new Date()).diff(
      checkin.created_at, "minutes"
    )

    if (diferencaEmMinutoDoCheckinCriadoParaAgora > 20) {
      throw new LateCheckinValidationError();
    }

    checkin.validated_at = new Date();

    await this.checkinsRepository.save(checkin);

    return { checkin };
  }
}
