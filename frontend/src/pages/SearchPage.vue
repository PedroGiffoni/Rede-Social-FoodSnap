<template>
  <MainLayout>
    <main class="search-page">
      <h1>Buscar</h1>

      <input
        v-model="term"
        class="search-input"
        placeholder="Busque por restaurante ou usuário..."
        @input="handleSearch"
      />

      <section v-if="loading" class="status">Buscando...</section>

      <section v-else-if="term.trim()">
        <h2>Resultados para "{{ term }}"</h2>

        <div v-if="hasNoResults" class="status">
          Nenhum resultado encontrado.
        </div>

        <section v-if="results.users.length">
          <h3>Usuários</h3>

          <SearchResultCard
            v-for="user in results.users"
            :key="user.id"
            :icon="user.userType === 'INFLUENCER' ? '⭐' : '👤'"
            :image-url="user.avatarUrl"
            :title="user.name"
            :subtitle="user.city || 'Usuário FoodSnap'"
            @click="router.push(`/usuarios/${user.id}`)"
          />
        </section>

        <section v-if="results.businesses.length">
          <h3>Restaurantes</h3>

          <SearchResultCard
            v-for="business in results.businesses"
            :key="business.id"
            icon="🍽️"
            :image-url="business.avatarUrl"
            :title="business.businessName"
            :subtitle="business.city || 'Cidade não informada'"
            @click="router.push(`/restaurantes/${business.id}`)"
          />
        </section>
      </section>

      <section v-else>
        <h2>Explorar</h2>

        <section v-if="topRestaurants.length">
          <h3>Restaurantes em destaque</h3>

          <SearchResultCard
            v-for="restaurant in topRestaurants"
            :key="restaurant.id"
            icon="🏆"
            :image-url="restaurant.avatarUrl"
            :title="`${restaurant.position}º ${restaurant.businessName}`"
            :subtitle="restaurant.city || 'Cidade não informada'"
            @click="router.push(`/restaurantes/${restaurant.id}`)"
          />
        </section>

        <section v-if="recentRestaurants.length">
          <h3>Restaurantes recentes</h3>

          <SearchResultCard
            v-for="restaurant in recentRestaurants"
            :key="restaurant.id"
            icon="🔥"
            :image-url="restaurant.avatarUrl"
            :title="restaurant.businessName"
            :subtitle="restaurant.city || 'Cidade não informada'"
            @click="router.push(`/restaurantes/${restaurant.id}`)"
          />
        </section>

        <section v-if="explorePosts.length">
          <h3>Últimas avaliações</h3>

          <PostCard v-for="post in explorePosts" :key="post.id" :post="post" />
        </section>
      </section>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import SearchResultCard from "../components/SearchResultCard.vue";
import PostCard from "../components/PostCard.vue";

import { searchUsers } from "../services/userService";

import {
  searchBusinesses,
  getAllBusinesses,
} from "../services/businessService";

import { getFeedPosts } from "../services/postService";

import type { GlobalSearchResult } from "../types/Search";
import type { Post } from "../types/Post";

/*
  SearchPage

  Tela de busca e exploração do FoodSnap.

  Quando o usuário digita:
  - busca usuários
  - busca restaurantes

  Quando o campo está vazio:
  - mostra restaurantes em destaque
  - mostra restaurantes recentes
  - mostra últimas avaliações
*/

const router = useRouter();

const term = ref("");
const loading = ref(false);

const explorePosts = ref<Post[]>([]);
const topRestaurants = ref<any[]>([]);
const recentRestaurants = ref<any[]>([]);

const results = reactive<GlobalSearchResult>({
  term: "",
  users: [],
  businesses: [],
  posts: [],
  categories: [],
});

const hasNoResults = computed(() => {
  return (
    results.users.length === 0 &&
    results.businesses.length === 0 &&
    results.posts.length === 0 &&
    results.categories.length === 0
  );
});

let searchTimeout: number | undefined;

/*
  Executa busca com atraso de 400ms.

  Isso evita chamar o backend a cada letra digitada
  de forma exagerada.
*/
async function handleSearch() {
  window.clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(async () => {
    if (!term.value.trim()) {
      clearResults();
      return;
    }

    try {
      loading.value = true;

      const [users, businesses] = await Promise.all([
        searchUsers(term.value),
        searchBusinesses(term.value),
      ]);

      results.term = term.value;

      /*
        Remove usuários BUSINESS da lista de usuários.

        Empresas aparecem somente em Restaurantes,
        para evitar duplicidade.
      */
      results.users = (users || []).filter((user: any) => {
        return user.userType !== "BUSINESS";
      });

      results.businesses = businesses || [];

      results.posts = [];
      results.categories = [];
    } catch {
      clearResults();
    } finally {
      loading.value = false;
    }
  }, 400);
}

/*
  Limpa os resultados da busca.
*/
function clearResults() {
  results.term = "";
  results.users = [];
  results.businesses = [];
  results.posts = [];
  results.categories = [];
}

/*
  Carrega conteúdo da área Explorar.

  Usa apenas endpoints já estáveis:
  - feed de postagens
  - lista de restaurantes
*/
async function loadExplore() {
  try {
    const [feedPosts, businesses] = await Promise.all([
      getFeedPosts(),
      getAllBusinesses(),
    ]);

    explorePosts.value = feedPosts.slice(0, 5);

    topRestaurants.value = businesses
      .slice(0, 5)
      .map((business: any, index: number) => {
        return {
          ...business,
          position: index + 1,
        };
      });

    recentRestaurants.value = [...businesses].reverse().slice(0, 5);
  } catch {
    explorePosts.value = [];
    topRestaurants.value = [];
    recentRestaurants.value = [];
  }
}

onMounted(() => {
  loadExplore();
});
</script>

<style scoped>
.search-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 16px;
}

h2 {
  margin: 20px 0 12px;
}

h3 {
  margin: 18px 0 10px;
}

.search-input {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.status {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #666;
}
</style>
