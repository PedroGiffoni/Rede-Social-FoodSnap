"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessFollowRepository = void 0;
const prisma_1 = require("../database/prisma");
class BusinessFollowRepository {
    async find(userId, businessProfileId) {
        return prisma_1.prisma.businessFollow.findUnique({
            where: {
                userId_businessProfileId: {
                    userId,
                    businessProfileId,
                },
            },
        });
    }
    async create(userId, businessProfileId) {
        return prisma_1.prisma.businessFollow.create({
            data: {
                userId,
                businessProfileId,
            },
        });
    }
    async delete(id) {
        return prisma_1.prisma.businessFollow.delete({
            where: {
                id,
            },
        });
    }
    async countFollowers(businessProfileId) {
        return prisma_1.prisma.businessFollow.count({
            where: {
                businessProfileId,
            },
        });
    }
    async listFollowedBusinesses(userId) {
        return prisma_1.prisma.businessFollow.findMany({
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
    async listFollowers(businessProfileId) {
        return prisma_1.prisma.businessFollow.findMany({
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
exports.BusinessFollowRepository = BusinessFollowRepository;
