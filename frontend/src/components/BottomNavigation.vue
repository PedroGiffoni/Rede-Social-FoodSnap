<template>
  <nav class="bottom-nav">
    <RouterLink to="/feed">
      🏠
      <span>Feed</span>
    </RouterLink>

    <RouterLink to="/buscar">
      🔍
      <span>Buscar</span>
    </RouterLink>

    <RouterLink to="/criar-post">
      ➕
      <span>Postar</span>
    </RouterLink>

    <RouterLink to="/cupons">
      🎟
      <span>Cupons</span>
    </RouterLink>

    <RouterLink to="/perfil">
      👤
      <span>Perfil</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
/*
  Menu principal do FoodSnap.

  Inspirado em Instagram/TikTok.
*/
</script>

<style scoped>
.bottom-nav {
  position: fixed;

  bottom: 0;
  left: 0;
  right: 0;

  height: 70px;

  background: white;

  display: flex;
  justify-content: space-around;
  align-items: center;

  border-top: 1px solid #ddd;
}

.bottom-nav a {
  text-decoration: none;

  color: #666;

  display: flex;
  flex-direction: column;

  align-items: center;

  font-size: 14px;
}

.router-link-active {
  color: #ff6b35 !important;
  font-weight: bold;
}
</style>
