"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  notificationRoutes

  Rotas do módulo de notificações.
*/
const notificationRoutes = (0, express_1.Router)();
exports.notificationRoutes = notificationRoutes;
const notificationController = new NotificationController_1.NotificationController();
notificationRoutes.get("/", authMiddleware_1.authMiddleware, notificationController.index);
notificationRoutes.get("/unread-count", authMiddleware_1.authMiddleware, notificationController.unreadCount);
notificationRoutes.patch("/read-all", authMiddleware_1.authMiddleware, notificationController.markAllAsRead);
