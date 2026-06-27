<template>
  <MainLayout>
    <div class="feed-page">
      <section v-if="loading" class="status">Carregando postagens...</section>

      <section v-else-if="error" class="status error">
        {{ error }}
      </section>

      <section v-else-if="posts.length === 0" class="status">
        Nenhuma postagem encontrada.
      </section>

      <section v-else>
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @deleted="handlePostDeleted"
        />
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../layouts/MainLayout.vue";
import { onMounted, ref } from "vue";
import PostCard from "../components/PostCard.vue";
import { getFeedPosts } from "../services/postService";
import type { Post } from "../types/Post";

/*
  FeedPage

  Tela principal do FoodSnap.
  Consome GET /posts do backend.
*/

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref("");

async function loadPosts() {
  try {
    loading.value = true;
    error.value = "";

    posts.value = await getFeedPosts();
  } catch {
    error.value = "Erro ao carregar o feed.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadPosts();
});

/*
  Remove instantaneamente um post da tela
  após exclusão.
*/
function handlePostDeleted(postId: string) {
  posts.value = posts.value.filter((post) => post.id !== postId);
}
</script>

<style scoped>
.feed-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

.feed-header {
  margin-bottom: 20px;
}

.feed-header h1 {
  font-size: 30px;
}

.feed-header p {
  color: #666;
}

.status {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.error {
  color: red;
}
</style>
