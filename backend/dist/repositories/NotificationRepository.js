"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_1 = require("../database/prisma");
class NotificationRepository {
    /*
      Cria uma notificação.
    */
    async create(data) {
        return prisma_1.prisma.notification.create({
            data,
        });
    }
    /*
      Lista notificações recebidas por um usuário.
    */
    async findByRecipientId(recipientId) {
        return prisma_1.prisma.notification.findMany({
            where: {
                recipientId,
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        userType: true,
                    },
                },
                post: true,
                comment: true,
                businessProfile: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        });
    }
    /*
      Marca todas as notificações do usuário como lidas.
    */
    async markAllAsRead(recipientId) {
        return prisma_1.prisma.notification.updateMany({
            where: {
                recipientId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    /*
      Conta notificações não lidas.
    */
    async countUnread(recipientId) {
        return prisma_1.prisma.notification.count({
            where: {
                recipientId,
                isRead: false,
            },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
