"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
/*
  NotificationController

  Recebe requisições HTTP relacionadas
  às notificações.
*/
class NotificationController {
    /*
      GET /notifications
  
      Lista notificações do usuário logado.
    */
    async index(req, res) {
        try {
            const notificationService = new NotificationService_1.NotificationService();
            const notifications = await notificationService.listMyNotifications(req.user?.id);
            return res.status(200).json(notifications);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar notificações.",
            });
        }
    }
    /*
      GET /notifications/unread-count
  
      Conta notificações não lidas.
    */
    async unreadCount(req, res) {
        try {
            const notificationService = new NotificationService_1.NotificationService();
            const result = await notificationService.countUnread(req.user?.id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao contar notificações.",
            });
        }
    }
    /*
      PATCH /notifications/read-all
  
      Marca todas como lidas.
    */
    async markAllAsRead(req, res) {
        try {
            const notificationService = new NotificationService_1.NotificationService();
            const result = await notificationService.markAllAsRead(req.user?.id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao marcar notificações como lidas.",
            });
        }
    }
}
exports.NotificationController = NotificationController;
