"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository_1.NotificationRepository();
    }
    /*
      Cria uma notificação.
  
      Regra importante:
      o usuário não deve receber notificação
      de uma ação feita por ele mesmo.
    */
    async createNotification(data) {
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
    async listMyNotifications(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return this.notificationRepository.findByRecipientId(userId);
    }
    /*
      Marca notificações como lidas.
    */
    async markAllAsRead(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return this.notificationRepository.markAllAsRead(userId);
    }
    /*
      Conta notificações não lidas.
    */
    async countUnread(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return {
            unreadCount: await this.notificationRepository.countUnread(userId),
        };
    }
}
exports.NotificationService = NotificationService;
