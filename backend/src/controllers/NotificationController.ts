import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";

/*
  NotificationController

  Recebe requisições HTTP relacionadas
  às notificações.
*/

export class NotificationController {
  /*
    GET /notifications

    Lista notificações do usuário logado.
  */
  async index(req: Request, res: Response) {
    try {
      const notificationService = new NotificationService();

      const notifications = await notificationService.listMyNotifications(
        req.user?.id as string,
      );

      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar notificações.",
      });
    }
  }

  /*
    GET /notifications/unread-count

    Conta notificações não lidas.
  */
  async unreadCount(req: Request, res: Response) {
    try {
      const notificationService = new NotificationService();

      const result = await notificationService.countUnread(
        req.user?.id as string,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao contar notificações.",
      });
    }
  }

  /*
    PATCH /notifications/read-all

    Marca todas como lidas.
  */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const notificationService = new NotificationService();

      const result = await notificationService.markAllAsRead(
        req.user?.id as string,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao marcar notificações como lidas.",
      });
    }
  }
}
