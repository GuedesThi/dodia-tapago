import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../checkinsRepository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async countByUserId(userId: string) {
    return this.items.filter((i) => i.user_id === userId).length;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((i) => i.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }
  // Método para encontrar um Check-In através do id de quem fez ele e a data do Check-in;
  async findByUserIdOnDate(userId: string, data: Date) {
    // Milessegundos inicias e finais da data enviada;
    const comecoDoDia = dayjs(data).startOf("date");
    const fimDoDia = dayjs(data).endOf("date");

    // Variável que ira receber (do método find()) o check-in com mesmo id e data;
    const checkinsNoMesmoDia = this.items.find((checkinSalvo) => {
      // Pegamos os milissegundos do check-in salvo na lista;
      const dataDosCheckinsSalvos = dayjs(checkinSalvo.created_at);

      // Pegamos o check-in que está entre os milessegundos da data enviada;
      const checkinsNaMesmaData =
        dataDosCheckinsSalvos.isAfter(comecoDoDia) &&
        dataDosCheckinsSalvos.isBefore(fimDoDia);

      // Retonarmos o checkin com os milessegundos da data enviada + que tenha o mesmo id da data enviada;
      return checkinSalvo.user_id === userId && checkinsNaMesmaData;
    });

    if (!checkinsNoMesmoDia) {
      return null;
    }

    return checkinsNoMesmoDia;
  }

  // Método para criar um Check-In
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
