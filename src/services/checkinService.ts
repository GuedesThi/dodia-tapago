import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/checkinsRepository";
import { GymRepository } from "../repositories/gymRepository";
import { ResourceNotFoundError } from "./erros/resource-not-found";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./erros/max-distance-error";
import { MaxNumberOfCheckinsError } from "./erros/max-number-of-checkins";

interface CheckinRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinResponse {
  checkin: CheckIn;
}

export class CheckinService {
  private checkinsRepository: CheckInsRepository;
  private gymRepository: GymRepository;

  constructor(checkinsRepository: CheckInsRepository, gymRepository: GymRepository) {
    this.checkinsRepository = checkinsRepository;
    this.gymRepository = gymRepository;
  }

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckinRequest): Promise<CheckinResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distancia = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLongitude},
      {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distancia > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    const checkOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkOnSameDay) {
      throw new MaxNumberOfCheckinsError();
    }

    const checkin = await this.checkinsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkin };
  }
}
