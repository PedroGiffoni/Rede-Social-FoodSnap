<template>
  <article class="result-card">
    <div class="icon">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" />

      <span v-else>
        {{ icon }}
      </span>
    </div>

    <div>
      <strong>{{ title }}</strong>
      <p>{{ subtitle }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
/*
  SearchResultCard

  Card reutilizável para resultados da busca.

  Agora aceita:
  - ícone padrão
  - foto real de usuário, quando existir imageUrl
*/

defineProps<{
  icon: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
}>();
</script>

<style scoped>
.result-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: 0.2s;
}
.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ff6b35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

p {
  color: #666;
  font-size: 14px;
}
</style>
