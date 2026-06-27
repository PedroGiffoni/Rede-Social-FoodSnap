<template>
  <div class="layout">
    <TopBar />

    <button class="notification-button" @click="router.push('/notificacoes')">
      🔔
      <span v-if="unreadCount > 0">
        {{ unreadCount }}
      </span>
    </button>

    <main class="content">
      <slot />
    </main>

    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import TopBar from "../components/TopBar.vue";
import BottomNavigation from "../components/BottomNavigation.vue";

import { getUnreadNotificationsCount } from "../services/notificationService";

const router = useRouter();

const unreadCount = ref(0);

async function loadUnreadCount() {
  try {
    const result = await getUnreadNotificationsCount();

    unreadCount.value = result.unreadCount;
  } catch {
    unreadCount.value = 0;
  }
}

onMounted(() => {
  loadUnreadCount();
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  position: relative;
}

.content {
  padding-bottom: 90px;
}

.notification-button {
  position: fixed;
  top: 18px;
  right: 18px;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: white;
  color: #222;

  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);

  cursor: pointer;
  z-index: 50;

  font-size: 18px;
}

.notification-button span {
  position: absolute;
  top: -5px;
  right: -5px;

  background: #ff6b35;
  color: white;

  border-radius: 999px;

  min-width: 18px;
  height: 18px;

  padding: 0 5px;

  font-size: 11px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
