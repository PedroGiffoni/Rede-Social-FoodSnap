import { api } from "../api/api";

/*
  notificationService

  Responsável por conversar com as rotas
  de notificações do backend.
*/

/*
  Lista notificações do usuário logado.
*/
export async function getMyNotifications() {
  const response = await api.get("/notifications");

  return response.data;
}

/*
  Conta notificações não lidas.
*/
export async function getUnreadNotificationsCount() {
  const response = await api.get("/notifications/unread-count");

  return response.data;
}

/*
  Marca todas as notificações como lidas.
*/
export async function markAllNotificationsAsRead() {
  const response = await api.patch("/notifications/read-all");

  return response.data;
}
