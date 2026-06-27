<template>
  <header class="topbar">
    <h1>🍔 FoodSnap</h1>

    <div class="right-side">
      <button
        class="notification-button"
        :class="{ pulse: hasNewNotification }"
        @click="goToNotifications"
      >
        🔔

        <span v-if="unreadCount > 0">
          {{ unreadCount }}
        </span>
      </button>

      <div class="user-info" v-if="authStore.user">
        <span>{{ authStore.user.name }}</span>
      </div>
    </div>

    <div v-if="showToast" class="notification-toast">
      🔔 Você tem uma nova notificação
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/authStore";

import { getUnreadNotificationsCount } from "../services/notificationService";

/*
  TopBar

  Barra superior da aplicação.

  Agora ela:
  - mostra botão de notificações
  - mostra quantidade de notificações não lidas
  - atualiza automaticamente a cada 10 segundos
  - exibe aviso visual quando chega notificação nova
*/

const authStore = useAuthStore();
const router = useRouter();

const unreadCount = ref(0);
const hasNewNotification = ref(false);
const showToast = ref(false);

let intervalId: number | undefined;

/*
  Carrega a quantidade de notificações não lidas.

  Se a nova quantidade for maior que a anterior,
  ativamos animação e mensagem visual.
*/
async function loadUnreadCount() {
  try {
    if (!authStore.user) {
      unreadCount.value = 0;
      return;
    }

    const previousCount = unreadCount.value;

    const result = await getUnreadNotificationsCount();

    const newCount = result.unreadCount || 0;

    unreadCount.value = newCount;

    if (newCount > previousCount && previousCount !== 0) {
      triggerNotificationAlert();
    }
  } catch {
    unreadCount.value = 0;
  }
}

/*
  Ativa o brilho do botão e mostra mensagem temporária.
*/
function triggerNotificationAlert() {
  hasNewNotification.value = true;
  showToast.value = true;

  window.setTimeout(() => {
    hasNewNotification.value = false;
  }, 4000);

  window.setTimeout(() => {
    showToast.value = false;
  }, 5000);
}

/*
  Abre a página de notificações.

  Ao clicar, limpamos o efeito visual local.
*/
function goToNotifications() {
  hasNewNotification.value = false;
  showToast.value = false;

  router.push("/notificacoes");
}

/*
  Ao montar o TopBar:
  - busca notificações uma vez
  - depois repete a cada 10 segundos
*/
onMounted(() => {
  loadUnreadCount();

  intervalId = window.setInterval(() => {
    loadUnreadCount();
  }, 10000);
});

/*
  Limpa o intervalo quando o componente sai da tela.
*/
onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
</script>

<style scoped>
.topbar {
  height: 70px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 20px;

  border-bottom: 1px solid #eee;

  position: sticky;
  top: 0;
  z-index: 100;
}

h1 {
  color: #ff6b35;
}

.right-side {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info {
  font-weight: bold;
}

.notification-button {
  position: relative;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: #f5f5f5;

  cursor: pointer;

  font-size: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

.notification-button:hover {
  background: #ececec;
}

.notification-button span {
  position: absolute;

  top: -5px;
  right: -5px;

  min-width: 18px;
  height: 18px;

  padding: 0 4px;

  border-radius: 999px;

  background: #ff6b35;
  color: white;

  font-size: 11px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

/*
  Efeito de brilho quando chega notificação nova.
*/
.notification-button.pulse {
  animation: pulseNotification 1s infinite;
  background: #ff6b35;
  color: white;
}

@keyframes pulseNotification {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 107, 53, 0.6);
  }

  50% {
    transform: scale(1.12);
    box-shadow: 0 0 18px rgba(255, 107, 53, 0.8);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 107, 53, 0.6);
  }
}

/*
  Mensagem flutuante de nova notificação.
*/
.notification-toast {
  position: fixed;

  top: 82px;
  right: 18px;

  background: #222;
  color: white;

  padding: 12px 16px;

  border-radius: 12px;

  font-size: 14px;
  font-weight: bold;

  box-shadow: 0 0 14px rgba(0, 0, 0, 0.18);

  z-index: 999;
}
</style>
