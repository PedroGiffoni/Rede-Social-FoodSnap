<template>
  <MainLayout>
    <main class="user-page">
      <!-- Estado de carregamento -->
      <section v-if="loading" class="status">Carregando usuário...</section>

      <!-- Estado de erro -->
      <section v-else-if="error" class="status error">
        {{ error }}
      </section>

      <!-- Conteúdo principal do perfil -->
      <template v-else-if="user">
        <section class="profile-card">
          <!--
            Avatar do usuário.

            Se o perfil for do usuário logado, a foto fica clicável
            e abre o popup de alteração de foto.
          -->
          <button
            class="avatar"
            :class="{ clickable: isOwnProfile }"
            @click="openAvatarModal"
          >
            <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.name" />

            <span v-else>
              {{ user.name.charAt(0).toUpperCase() }}
            </span>
          </button>

          <!-- Input escondido usado pelo popup para carregar nova foto -->
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            hidden
            @change="handleAvatarUpload"
          />

          <div class="profile-info">
            <h1>{{ user.name }}</h1>
            <p>@{{ username }}</p>
          </div>

          <!-- Botão de seguir só aparece quando não é o próprio perfil -->
          <button
            v-if="!isOwnProfile"
            class="follow-button"
            @click="handleFollow"
          >
            {{ following ? "Seguindo" : "Seguir" }}
          </button>
        </section>

        <!-- Estatísticas do perfil -->
        <section class="stats">
          <button @click="activeTab = 'posts'">
            <strong>{{ posts.length }}</strong>
            <span>Postagens</span>
          </button>

          <button @click="activeTab = 'followers'">
            <strong>{{ stats.followersCount }}</strong>
            <span>Seguidores</span>
          </button>

          <button @click="activeTab = 'following'">
            <strong>{{ stats.followingCount }}</strong>
            <span>Seguindo</span>
          </button>
        </section>

        <!-- Aba de postagens -->
        <section v-if="activeTab === 'posts'">
          <h2>Postagens</h2>

          <p v-if="posts.length === 0" class="status">
            Este usuário ainda não publicou nada.
          </p>

          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </section>

        <!-- Aba de seguidores -->
        <section v-else-if="activeTab === 'followers'">
          <h2>Seguidores</h2>

          <p v-if="followers.length === 0" class="status">
            Este usuário ainda não possui seguidores.
          </p>

          <article
            v-for="item in followers"
            :key="item.id"
            class="user-list-card"
            @click="goToUser(item.follower.id)"
          >
            <div class="small-avatar">
              <img
                v-if="item.follower.avatarUrl"
                :src="item.follower.avatarUrl"
                :alt="item.follower.name"
              />

              <span v-else>
                {{ item.follower.name.charAt(0).toUpperCase() }}
              </span>
            </div>

            <div>
              <strong>{{ item.follower.name }}</strong>
              <p>@{{ makeUsername(item.follower.name) }}</p>
            </div>
          </article>
        </section>

        <!-- Aba de seguindo -->
        <section v-else>
          <h2>Seguindo</h2>

          <p v-if="followingUsers.length === 0" class="status">
            Este usuário ainda não segue ninguém.
          </p>

          <article
            v-for="item in followingUsers"
            :key="item.id"
            class="user-list-card"
            @click="goToUser(item.following.id)"
          >
            <div class="small-avatar">
              <img
                v-if="item.following.avatarUrl"
                :src="item.following.avatarUrl"
                :alt="item.following.name"
              />

              <span v-else>
                {{ item.following.name.charAt(0).toUpperCase() }}
              </span>
            </div>

            <div>
              <strong>{{ item.following.name }}</strong>
              <p>@{{ makeUsername(item.following.name) }}</p>
            </div>
          </article>
        </section>

        <!-- Popup de alteração da foto de perfil -->
        <section
          v-if="showAvatarModal"
          class="modal-overlay"
          @click.self="showAvatarModal = false"
        >
          <div class="avatar-modal">
            <h2>Alterar foto do perfil</h2>

            <button class="modal-option upload" @click="openAvatarFilePicker">
              Carregar foto
            </button>

            <button class="modal-option remove" @click="handleRemoveAvatar">
              Excluir foto atual
            </button>

            <button
              class="modal-option cancel"
              @click="showAvatarModal = false"
            >
              Cancelar
            </button>
          </div>
        </section>
      </template>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import PostCard from "../components/PostCard.vue";

import { useAuthStore } from "../stores/authStore";

import { getUserById, updateMyAvatar } from "../services/userService";

import { uploadFile } from "../services/uploadService";

import { getPostsByUser } from "../services/postService";

import {
  getFollowStats,
  getFollowers,
  getFollowing,
} from "../services/followService";

import { api } from "../api/api";

import type { Post } from "../types/Post";

/*
  UserProfilePage

  Perfil público de qualquer usuário.

  Quando o perfil é do usuário logado:
  - a própria foto fica clicável
  - abre popup estilo Instagram
  - permite carregar foto
  - permite excluir foto atual

  Quando é perfil de outro usuário:
  - exibe botão seguir
  - foto não abre edição
*/

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref("");

const user = ref<any | null>(null);
const posts = ref<Post[]>([]);
const followers = ref<any[]>([]);
const followingUsers = ref<any[]>([]);
const following = ref(false);

const activeTab = ref<"posts" | "followers" | "following">("posts");

const showAvatarModal = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);
const uploadingAvatar = ref(false);

const stats = reactive({
  followersCount: 0,
  followingCount: 0,
});

/*
  Verifica se o perfil aberto pertence ao usuário logado.
*/
const isOwnProfile = computed(() => {
  return authStore.user?.id === user.value?.id;
});

/*
  Cria o username visual baseado no nome.
*/
const username = computed(() => {
  if (!user.value) {
    return "";
  }

  return makeUsername(user.value.name);
});

/*
  Remove acentos e espaços para gerar username visual.
*/
function makeUsername(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

/*
  Carrega todos os dados do perfil:
  - dados do usuário
  - postagens
  - estatísticas
  - seguidores
  - seguindo
*/
async function loadUserProfile() {
  try {
    loading.value = true;
    error.value = "";

    const userId = String(route.params.id);

    const [userData, postsData, followStats, followersData, followingData] =
      await Promise.all([
        getUserById(userId),
        getPostsByUser(userId),
        getFollowStats(userId),
        getFollowers(userId),
        getFollowing(userId),
      ]);

    user.value = userData;
    posts.value = postsData;
    followers.value = followersData;
    followingUsers.value = followingData;

    stats.followersCount = followStats.followersCount;
    stats.followingCount = followStats.followingCount;
  } catch {
    error.value = "Erro ao carregar perfil do usuário.";
  } finally {
    loading.value = false;
  }
}

/*
  Abre o modal de foto apenas se for o próprio perfil.
*/
function openAvatarModal() {
  if (!isOwnProfile.value) {
    return;
  }

  showAvatarModal.value = true;
}

/*
  Abre o seletor de arquivo escondido.
*/
function openAvatarFilePicker() {
  avatarInput.value?.click();
}

/*
  Envia nova foto para upload e salva no perfil do usuário.
*/
async function handleAvatarUpload(event: Event) {
  try {
    if (!isOwnProfile.value || !user.value) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    uploadingAvatar.value = true;

    const uploaded = await uploadFile(file);

    const updated = await updateMyAvatar(uploaded.url);

    user.value = {
      ...user.value,
      avatarUrl: updated.avatarUrl,
    };

    showAvatarModal.value = false;
    input.value = "";
  } catch {
    alert("Erro ao trocar foto.");
  } finally {
    uploadingAvatar.value = false;
  }
}

/*
  Remove foto atual do perfil.
*/
async function handleRemoveAvatar() {
  try {
    if (!isOwnProfile.value || !user.value) {
      return;
    }

    const updated = await updateMyAvatar("");

    user.value = {
      ...user.value,
      avatarUrl: updated.avatarUrl,
    };

    showAvatarModal.value = false;
  } catch {
    alert("Erro ao remover foto.");
  }
}

/*
  Segue ou deixa de seguir outro usuário.
*/
async function handleFollow() {
  if (!user.value) {
    return;
  }

  const response = await api.post(`/users/${user.value.id}/follow`);

  following.value = response.data.following;
  stats.followersCount = response.data.followersCount;

  await loadUserProfile();
}

/*
  Navega para outro perfil.
*/
function goToUser(userId: string) {
  router.push(`/usuarios/${userId}`);
}

onMounted(() => {
  loadUserProfile();
});

/*
  Quando muda o ID da rota, recarrega o perfil.
*/
watch(
  () => route.params.id,
  () => {
    activeTab.value = "posts";
    loadUserProfile();
  },
);
</script>

<style scoped>
.user-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  position: relative;
  background: white;
  padding: 24px;
  border-radius: 18px;

  display: flex;
  align-items: center;
  gap: 18px;

  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
}

.avatar {
  width: 76px;
  height: 76px;

  border: none;
  border-radius: 50%;

  background: #ff6b35;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  font-size: 30px;
  font-weight: bold;

  padding: 0;
}

.avatar.clickable {
  cursor: pointer;
}

.avatar.clickable:hover {
  opacity: 0.85;
}

.avatar img,
.small-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h1 {
  font-size: 24px;
}

.profile-info p {
  color: #777;
}

.follow-button {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #ff6b35;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stats button {
  background: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.stats strong {
  display: block;
  color: #ff6b35;
  font-size: 20px;
}

.stats span {
  font-size: 12px;
  color: #666;
}

.user-list-card {
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
}

.user-list-card:hover {
  background: #fff3ed;
}

.small-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #ff6b35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: bold;
}

.user-list-card p {
  color: #777;
  font-size: 14px;
}

.status {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #666;
}

.error {
  color: red;
}

h2 {
  margin-bottom: 14px;
}

/*
  Fundo escuro do popup.
*/
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
}

/*
  Caixa central do popup.
*/
.avatar-modal {
  width: min(560px, calc(100% - 32px));
  background: #26272d;
  border-radius: 18px;
  overflow: hidden;
  text-align: center;
  color: white;
}

.avatar-modal h2 {
  padding: 26px 16px;
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 1px solid #3a3b41;
}

/*
  Botões internos do popup.
*/
.modal-option {
  width: 100%;
  border: none;
  border-bottom: 1px solid #3a3b41;
  background: transparent;
  padding: 16px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
}

.modal-option.upload {
  color: #6384ff;
}

.modal-option.remove {
  color: #ff4d62;
}

.modal-option.cancel {
  border-bottom: none;
  color: white;
  font-weight: 400;
}
</style>
