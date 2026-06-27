import { prisma } from "../database/prisma";
import { NotificationType } from "@prisma/client";

/*
  NotificationRepository

  Camada responsável por acessar diretamente
  a tabela notifications.
*/

interface CreateNotificationData {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  businessProfileId?: string;
}

export class NotificationRepository {
  /*
    Cria uma notificação.
  */
  async create(data: CreateNotificationData) {
    return prisma.notification.create({
      data,
    });
  }

  /*
    Lista notificações recebidas por um usuário.
  */
  async findByRecipientId(recipientId: string) {
    return prisma.notification.findMany({
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
  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
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
  async countUnread(recipientId: string) {
    return prisma.notification.count({
      where: {
        recipientId,
        isRead: false,
      },
    });
  }
}
