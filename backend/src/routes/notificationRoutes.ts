import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  notificationRoutes

  Rotas do módulo de notificações.
*/

const notificationRoutes = Router();

const notificationController = new NotificationController();

notificationRoutes.get("/", authMiddleware, notificationController.index);

notificationRoutes.get(
  "/unread-count",
  authMiddleware,
  notificationController.unreadCount,
);

notificationRoutes.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead,
);

export { notificationRoutes };
