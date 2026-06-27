import { prisma } from "../database/prisma";

export class BusinessFollowRepository {
  async find(userId: string, businessProfileId: string) {
    return prisma.businessFollow.findUnique({
      where: {
        userId_businessProfileId: {
          userId,
          businessProfileId,
        },
      },
    });
  }

  async create(userId: string, businessProfileId: string) {
    return prisma.businessFollow.create({
      data: {
        userId,
        businessProfileId,
      },
    });
  }

  async delete(id: string) {
    return prisma.businessFollow.delete({
      where: {
        id,
      },
    });
  }

  async countFollowers(businessProfileId: string) {
    return prisma.businessFollow.count({
      where: {
        businessProfileId,
      },
    });
  }

  async listFollowedBusinesses(userId: string) {
    return prisma.businessFollow.findMany({
      where: {
        userId,
      },
      include: {
        businessProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  /*
  Lista seguidores de um restaurante.
*/
  async listFollowers(businessProfileId: string) {
    return prisma.businessFollow.findMany({
      where: {
        businessProfileId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            city: true,
            userType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
