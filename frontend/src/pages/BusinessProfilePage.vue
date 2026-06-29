<template>
  <MainLayout>
    <main class="business-page">
      <!-- Estado de carregamento da página pública -->
      <section v-if="loading" class="status">Carregando restaurante...</section>

      <!-- Estado de erro -->
      <section v-else-if="error" class="status error">
        {{ error }}
      </section>

      <!-- Conteúdo principal da página pública do restaurante -->
      <template v-else-if="business">
        <!-- Card superior com capa, avatar e informações do restaurante -->
        <section class="business-cover">
          <!-- Capa do restaurante -->
          <div class="cover-image">
            <img
              v-if="business.coverUrl"
              :src="business.coverUrl"
              alt="Capa do restaurante"
            />

            <span v-else>🍽️</span>
          </div>

          <!-- Cabeçalho com logo e dados -->
          <div class="business-header">
            <div class="business-avatar">
              <img
                v-if="business.avatarUrl"
                :src="business.avatarUrl"
                alt="Logo do restaurante"
              />

              <span v-else>🍔</span>
            </div>

            <div class="business-info">
              <h1>{{ business.businessName }}</h1>

              <p v-if="business.description">
                {{ business.description }}
              </p>

              <p v-if="business.city">📍 {{ business.city }}</p>

              <p v-if="business.address">
                {{ business.address }}
              </p>

              <p v-if="business.openingHours">🕒 {{ business.openingHours }}</p>

              <a
                v-if="business.website"
                class="website-link"
                :href="formatWebsiteUrl(business.website)"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 {{ business.website }}
              </a>

              <p v-if="business.isClaimed" class="claimed">✅ Perfil oficial</p>

              <p v-else class="not-claimed">Perfil ainda não reivindicado</p>

              <!-- Botões de interação com o restaurante -->
              <div class="business-actions">
                <button class="action-button" @click="handleSaveBusiness">
                  {{ saved ? "❤️ Salvo" : "🤍 Salvar" }}
                </button>

                <button class="action-button" @click="handleFollowBusiness">
                  {{ following ? "👥 Seguindo" : "👥 Seguir" }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Estatísticas principais -->
        <section class="stats">
          <!--
            Card de seguidores clicável.

            Ao clicar:
            - carrega seguidores do backend
            - abre popup com lista de usuários
          -->
          <button class="stat-button" @click="openFollowersModal">
            <strong>{{ followersCount }}</strong>
            <span>Seguidores</span>
          </button>

          <div>
            <strong>{{ averageRating }}</strong>
            <span>Média</span>
          </div>

          <button class="stat-button" @click="showCouponsModal = true">
            <strong>{{ coupons.length }}</strong>
            <span>Cupons</span>
          </button>

          <div>
            <strong>{{ posts.length }}</strong>
            <span>Avaliações</span>
          </div>
        </section>

        <!-- Galeria horizontal com fotos das postagens -->
        <section v-if="galleryPosts.length" class="gallery-section">
          <h2>Galeria</h2>

          <div class="gallery-grid">
            <button
              v-for="post in galleryPosts"
              :key="post.id"
              class="gallery-item"
              @click="scrollToPost(post.id)"
            >
              <img :src="post.medias[0].mediaUrl" :alt="post.title" />
            </button>
          </div>
        </section>

        <!-- Postagens relacionadas ao restaurante -->
        <section>
          <h2>Postagens sobre este restaurante</h2>

          <p v-if="posts.length === 0" class="status">
            Nenhuma postagem encontrada.
          </p>

          <div
            v-for="post in posts"
            :key="post.id"
            :id="`post-${post.id}`"
            class="post-anchor"
          >
            <PostCard :post="post" />
          </div>
        </section>

        <!-- Popup de seguidores -->
        <section
          v-if="showFollowersModal"
          class="modal-overlay"
          @click.self="showFollowersModal = false"
        >
          <div class="followers-modal">
            <header class="modal-header">
              <h2>Seguidores</h2>

              <button @click="showFollowersModal = false">✕</button>
            </header>

            <section v-if="loadingFollowers" class="modal-status">
              Carregando seguidores...
            </section>

            <section
              v-else-if="businessFollowers.length === 0"
              class="modal-status"
            >
              Este restaurante ainda não possui seguidores.
            </section>

            <section v-else>
              <article
                v-for="item in businessFollowers"
                :key="item.id"
                class="follower-card"
                @click="goToUser(item.user.id)"
              >
                <div class="follower-avatar">
                  <img
                    v-if="item.user.avatarUrl"
                    :src="item.user.avatarUrl"
                    :alt="item.user.name"
                  />

                  <span v-else>
                    {{ item.user.name.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div>
                  <strong>{{ item.user.name }}</strong>

                  <p>
                    {{ item.user.city || "Usuário FoodSnap" }}
                  </p>
                </div>
              </article>
            </section>
          </div>
        </section>

        <section
          v-if="showCouponsModal"
          class="modal-overlay"
          @click.self="showCouponsModal = false"
        >
          <div class="coupons-modal">
            <header class="modal-header">
              <h2>Cupons disponíveis</h2>

              <button @click="showCouponsModal = false">✕</button>
            </header>

            <section v-if="coupons.length === 0" class="modal-status">
              Este restaurante ainda não possui cupons ativos.
            </section>

            <section v-else>
              <article
                v-for="coupon in coupons"
                :key="coupon.id"
                class="modal-coupon-card"
                @click="copyCouponCode(coupon.code)"
              >
                <strong>{{ coupon.title }}</strong>

                <p v-if="coupon.description">
                  {{ coupon.description }}
                </p>

                <span>{{ coupon.code }}</span>
              </article>
            </section>
          </div>
        </section>
      </template>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
/*
  Imports principais do Vue.
*/
import { computed, onMounted, ref } from "vue";

/*
  useRoute:
  pega o ID do restaurante na URL.

  useRouter:
  permite navegar para o perfil do seguidor.
*/
import { useRoute, useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import PostCard from "../components/PostCard.vue";

/*
  Serviços do restaurante.
*/
import {
  getBusinessById,
  getBusinessCoupons,
  getBusinessPosts,
  getBusinessFollowersCount,
  getBusinessFollowers,
  getBusinessFollowStatus,
  toggleFollowBusiness,
} from "../services/businessService";

/*
  Serviço de salvos.
*/
import { toggleSavedBusiness } from "../services/savedService";

import type { BusinessProfile, Coupon } from "../types/Business";
import type { Post } from "../types/Post";

const route = useRoute();
const router = useRouter();

/*
  Estados principais da página.
*/
const loading = ref(true);
const error = ref("");

const business = ref<BusinessProfile | null>(null);
const posts = ref<Post[]>([]);
const coupons = ref<Coupon[]>([]);

const saved = ref(false);
const following = ref(false);
const followersCount = ref(0);

/*
  Estados do popup de seguidores.
*/
const showFollowersModal = ref(false);
const loadingFollowers = ref(false);
const businessFollowers = ref<any[]>([]);
/*
  Estados do popup de cupons.
*/
const showCouponsModal = ref(false);

/*
  Calcula a média das avaliações com base nas postagens avaliadas.
*/
const averageRating = computed(() => {
  const ratedPosts = posts.value.filter((post) => post.averageRating);

  if (ratedPosts.length === 0) {
    return "0.0";
  }

  const total = ratedPosts.reduce((sum, post) => {
    return sum + Number(post.averageRating);
  }, 0);

  return (total / ratedPosts.length).toFixed(1);
});

/*
  Filtra posts que possuem foto para montar a galeria.
*/
const galleryPosts = computed(() => {
  return posts.value.filter((post) => {
    return post.medias?.[0] && post.medias[0].mediaType === "PHOTO";
  });
});

/*
  Carrega os dados públicos do restaurante.
*/
async function loadBusinessPage() {
  try {
    loading.value = true;
    error.value = "";

    const businessId = String(route.params.id);

    const [businessData, postsData, couponsData, followersData] =
      await Promise.all([
        getBusinessById(businessId),
        getBusinessPosts(businessId),
        getBusinessCoupons(businessId),
        getBusinessFollowersCount(businessId),
      ]);

    business.value = businessData;

    try {
      const followStatus = await getBusinessFollowStatus(businessId);

      following.value = followStatus.following;
    } catch {
      following.value = false;
    }

    posts.value = postsData.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    coupons.value = couponsData.filter((coupon) => coupon.isActive);

    followersCount.value = followersData.followersCount || 0;
  } catch {
    error.value = "Erro ao carregar restaurante.";
  } finally {
    loading.value = false;
  }
}

/*
  Salva ou remove o restaurante dos favoritos.
*/
async function handleSaveBusiness() {
  if (!business.value) {
    return;
  }

  try {
    const result = await toggleSavedBusiness(business.value.id);

    saved.value = result.saved;
  } catch {
    alert("Erro ao salvar.");
  }
}

/*
  Segue ou deixa de seguir o restaurante.
*/
async function handleFollowBusiness() {
  if (!business.value) {
    return;
  }

  try {
    const result = await toggleFollowBusiness(business.value.id);

    following.value = result.following;
    followersCount.value = result.followersCount;
  } catch {
    alert("Erro ao seguir.");
  }
}

/*
  Abre o popup e carrega a lista de seguidores do restaurante.
*/
async function openFollowersModal() {
  if (!business.value) {
    return;
  }

  try {
    showFollowersModal.value = true;
    loadingFollowers.value = true;

    businessFollowers.value = await getBusinessFollowers(business.value.id);
  } catch {
    businessFollowers.value = [];
  } finally {
    loadingFollowers.value = false;
  }
}

/*
  Navega para o perfil público do usuário seguidor.
*/
function goToUser(userId: string) {
  showFollowersModal.value = false;

  router.push(`/usuarios/${userId}`);
}

/*
  Copia o código do cupom.
*/
async function copyCouponCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);

    alert("Código copiado.");
  } catch {
    alert("Não foi possível copiar o código.");
  }
}

/*
  Rola até a postagem clicada na galeria.
*/
function scrollToPost(postId: string) {
  const element = document.getElementById(`post-${postId}`);

  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function formatWebsiteUrl(website: string) {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
}

onMounted(() => {
  loadBusinessPage();
});
</script>

<style scoped>
.business-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

.business-cover {
  overflow: hidden;
  border-radius: 18px;
  margin-bottom: 20px;
  background: white;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
}

.cover-image {
  height: 180px;
  background: linear-gradient(135deg, #ff6b35, #ff8f5c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-header {
  padding: 20px;
  display: flex;
  gap: 16px;
}

.business-avatar {
  width: 76px;
  height: 76px;
  min-width: 76px;
  min-height: 76px;
  border-radius: 50%;
  background: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  overflow: hidden;
}

.business-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.business-info h1 {
  margin-bottom: 8px;
}

.business-info p {
  color: #555;
  margin-bottom: 5px;
}

.claimed {
  margin-top: 8px;
  color: green !important;
  font-weight: bold;
}

.not-claimed {
  margin-top: 8px;
  color: #777 !important;
}

.instagram-link {
  display: inline-block;
  margin-top: 6px;
  color: #e1306c;
  text-decoration: none;
  font-weight: bold;
}

.instagram-link:hover {
  text-decoration: underline;
}

.business-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.action-button {
  border: none;
  border-radius: 999px;
  background: #ff6b35;
  color: white;
  padding: 8px 13px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

.stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stats div,
.stat-button {
  background: white;
  padding: 14px;
  border-radius: 12px;
  text-align: center;
  border: none;
  cursor: default;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.stat-button {
  cursor: pointer;
}

.stat-button:hover {
  background: #fff3ed;
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

.coupons {
  margin-bottom: 20px;
}

.coupon-card {
  background: white;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
}

.coupons-modal {
  width: min(560px, calc(100% - 32px));
  max-height: 80vh;
  overflow-y: auto;
  background: #26272d;
  border-radius: 18px;
  color: white;
}

.modal-coupon-card {
  padding: 16px 18px;
  border-bottom: 1px solid #3a3b41;
  cursor: pointer;
}

.modal-coupon-card:hover {
  background: #32333a;
}

.modal-coupon-card p {
  color: #bbb;
  margin-top: 4px;
}

.modal-coupon-card span {
  display: inline-block;
  margin-top: 10px;
  background: #ff6b35;
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: bold;
}

.gallery-section {
  margin-bottom: 20px;
}

.gallery-grid {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
}

.gallery-item {
  width: 86px;
  height: 86px;
  min-width: 86px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: #eee;
  overflow: hidden;
  border-radius: 10px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item:hover {
  opacity: 0.85;
}

.post-anchor {
  scroll-margin-top: 20px;
}

.status,
.modal-status {
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
  margin: 20px 0 12px;
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
  Caixa do popup de seguidores.
*/
.followers-modal {
  width: min(560px, calc(100% - 32px));
  max-height: 80vh;
  overflow-y: auto;

  background: #26272d;
  border-radius: 18px;
  color: white;
}

/*
  Cabeçalho do popup.
*/
.modal-header {
  padding: 18px;
  border-bottom: 1px solid #3a3b41;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
}

.modal-header button {
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 18px;
}

/*
  Card de cada seguidor.
*/
.follower-card {
  padding: 14px 18px;

  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;
  border-bottom: 1px solid #3a3b41;
}

.follower-card:hover {
  background: #32333a;
}

.follower-avatar {
  width: 46px;
  height: 46px;

  min-width: 46px;
  min-height: 46px;

  border-radius: 50%;
  overflow: hidden;

  background: #ff6b35;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
}

.follower-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follower-card p {
  color: #bbb;
  font-size: 14px;
}

@media (max-width: 520px) {
  .business-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
