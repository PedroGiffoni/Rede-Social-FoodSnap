<template>
  <MainLayout>
    <main class="notifications-page">
      <header class="page-header">
        <h1>Notificações</h1>

        <button v-if="notifications.length" @click="handleMarkAllAsRead">
          Marcar todas como lidas
        </button>
      </header>

      <section v-if="loading" class="status">
        Carregando notificações...
      </section>

      <section v-else-if="notifications.length === 0" class="status">
        Você ainda não possui notificações.
      </section>

      <section v-else>
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-card"
          :class="{ unread: !notification.isRead }"
          @click="openNotification(notification)"
        >
          <div class="avatar">
            <img
              v-if="notification.actor?.avatarUrl"
              :src="notification.actor.avatarUrl"
              :alt="notification.actor.name"
            />

            <span v-else>
              {{ notification.actor?.name?.charAt(0).toUpperCase() || "?" }}
            </span>
          </div>

          <div class="notification-content">
            <p>
              <strong>{{ notification.actor?.name || "Alguém" }}</strong>
              {{ getNotificationMessage(notification) }}
            </p>

            <span>
              {{ formatDate(notification.createdAt) }}
            </span>
          </div>
        </article>
      </section>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from "../services/notificationService";

/*
  NotificationsPage

  Tela que lista notificações do usuário logado.
*/

const router = useRouter();

const loading = ref(true);
const notifications = ref<any[]>([]);

/*
  Carrega notificações do backend.
*/
async function loadNotifications() {
  try {
    loading.value = true;

    notifications.value = await getMyNotifications();
  } finally {
    loading.value = false;
  }
}

/*
  Define a mensagem textual conforme o tipo.
*/
function getNotificationMessage(notification: any) {
  if (notification.type === "LIKE") {
    return "curtiu sua postagem.";
  }

  if (notification.type === "COMMENT") {
    return "comentou na sua postagem.";
  }

  if (notification.type === "FOLLOW") {
    return "começou a seguir você.";
  }

  if (notification.type === "SAVE_BUSINESS") {
    return "salvou seu restaurante.";
  }

  return "interagiu com você.";
}

/*
  Abre o destino da notificação.
*/
function openNotification(notification: any) {
  if (notification.postId) {
    router.push(`/feed`);
    return;
  }

  if (notification.actorId) {
    router.push(`/usuarios/${notification.actorId}`);
  }
}

/*
  Marca todas como lidas.
*/
async function handleMarkAllAsRead() {
  await markAllNotificationsAsRead();

  notifications.value = notifications.value.map((notification) => {
    return {
      ...notification,
      isRead: true,
    };
  });
}

/*
  Formata data para leitura simples.
*/
function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}

onMounted(() => {
  loadNotifications();
});
</script>

<style scoped>
.notifications-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.page-header button {
  border: none;
  border-radius: 999px;
  background: #222;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
}

.status {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #666;
}

.notification-card {
  background: white;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;

  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
}

.notification-card.unread {
  border-left: 5px solid #ff6b35;
}

.avatar {
  width: 44px;
  height: 44px;

  min-width: 44px;
  min-height: 44px;

  border-radius: 50%;
  overflow: hidden;

  background: #ff6b35;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-content p {
  color: #333;
  margin-bottom: 4px;
}

.notification-content span {
  color: #777;
  font-size: 12px;
}
</style>
