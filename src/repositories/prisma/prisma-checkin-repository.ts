import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../checkinsRepository";
import { prisma } from "../../server";
import dayjs from "dayjs";

export class PrismaCheckinRepository implements CheckInsRepository {
  // Cria CheckIn;
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = await prisma.checkIn.create({
      data,
    });

    return checkin;
  }

  // Quando o usuário tentar criar um CheckIn, esse método vai procurar um já feito na mesma data. Se for encontrado ele não poderá fazer;
  async findByUserIdOnDate(userId: string, data: Date) {
    const comecoDoDia = dayjs(data).startOf("date");
    const fimDoDia = dayjs(data).endOf("date");

    const checkin = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: comecoDoDia.toDate(),
          lte: fimDoDia.toDate(),
        },
      },
    });

    if (!checkin) {
      return null;
    }

    return checkin;
  }

  // Retorna todos os CheckIns de um usuário, e somente os CheckIns da página informada (20 por página);
  async findManyByUserId(userId: string, page: number) {
    const checkins = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkins;
  }

  // Retorna o número total de CheckIns feitos por um usuário;
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

  // Procura um CheckIn pelo seu ID;
  async findById(id: string) {
    const checkin = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkin;
  }

  // Atualiza um CheckIn já criado;
  async save(checkin: CheckIn) {
    const newCheckin = await prisma.checkIn.update({
      where: {
        id: checkin.id,
      },
      data: checkin,
    });

    return newCheckin;
  }
}
