import { NotificationType } from "@prisma/client";
import { NotificationRepository } from "../repositories/NotificationRepository";

/*
  NotificationService

  Camada de regra de negócio das notificações.
*/

interface CreateNotificationRequest {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  businessProfileId?: string;
}

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  /*
    Cria uma notificação.

    Regra importante:
    o usuário não deve receber notificação
    de uma ação feita por ele mesmo.
  */
  async createNotification(data: CreateNotificationRequest) {
    if (!data.recipientId || !data.actorId) {
      return null;
    }

    if (data.recipientId === data.actorId) {
      return null;
    }

    return this.notificationRepository.create(data);
  }

  /*
    Lista notificações do usuário logado.
  */
  async listMyNotifications(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.notificationRepository.findByRecipientId(userId);
  }

  /*
    Marca notificações como lidas.
  */
  async markAllAsRead(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.notificationRepository.markAllAsRead(userId);
  }

  /*
    Conta notificações não lidas.
  */
  async countUnread(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return {
      unreadCount: await this.notificationRepository.countUnread(userId),
    };
  }
}
