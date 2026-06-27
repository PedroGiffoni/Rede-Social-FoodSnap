<template>
  <MainLayout>
    <main class="business-dashboard">
      <!-- Estado exibido enquanto os dados do painel estão sendo carregados -->
      <section v-if="loading" class="status">
        Carregando painel do restaurante...
      </section>

      <!-- Estado exibido caso aconteça algum erro ao buscar os dados -->
      <section v-else-if="error" class="status error">
        {{ error }}
      </section>

      <!-- Conteúdo principal do painel. Só aparece quando existe restaurante carregado -->
      <template v-else-if="business">
        <!-- Botão para sair da conta -->
        <button class="logout-button" @click="handleLogout">Sair</button>

        <!-- Card superior com capa, logo e dados principais do restaurante -->
        <section class="business-cover">
          <!-- Imagem de capa do restaurante -->
          <div class="cover-image">
            <img
              v-if="business.coverUrl"
              :src="business.coverUrl"
              alt="Capa do restaurante"
            />

            <span v-else>🍽️</span>
          </div>

          <!-- Botão para trocar capa -->
          <div class="cover-actions">
            <label class="image-button">
              🖼️ Trocar capa

              <input
                type="file"
                accept="image/*"
                hidden
                @change="handleCoverUpload"
              />
            </label>
          </div>

          <!-- Cabeçalho com avatar e informações -->
          <div class="business-header">
            <!-- Área da logo/foto do restaurante -->
            <div class="avatar-area">
              <!--
                Agora a própria foto é clicável.

                Ao clicar nela, abrimos um popup parecido com o Instagram,
                com as opções:
                - carregar foto
                - excluir foto atual
                - cancelar
              -->
              <button
                class="business-avatar avatar-clickable"
                @click="showAvatarModal = true"
              >
                <img
                  v-if="business.avatarUrl"
                  :src="business.avatarUrl"
                  alt="Logo do restaurante"
                />

                <span v-else>🍔</span>
              </button>

              <!-- Input escondido usado pelo popup para escolher imagem -->
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                hidden
                @change="handleAvatarUpload"
              />
            </div>

            <!-- Dados textuais do restaurante -->
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
                :href="business.website"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 {{ business.website }}
              </a>

              <p class="claimed">✅ Perfil oficial</p>
            </div>
          </div>
        </section>

        <!-- Estatísticas principais do restaurante -->
        <section class="stats">
          <div>
            <strong>{{ posts.length }}</strong>
            <span>Postagens</span>
          </div>

          <div>
            <strong>{{ averageRating }}</strong>
            <span>Média</span>
          </div>

          <div>
            <strong>{{ coupons.length }}</strong>
            <span>Cupons</span>
          </div>

          <div>
            <strong>{{ followersCount }}</strong>
            <span>Seguidores</span>
          </div>
        </section>

        <!-- Ações principais do painel -->
        <section class="actions-panel">
          <button @click="goToPublicPage">👁️ Ver página pública</button>

          <button @click="showEditForm = !showEditForm">
            ✏️ Editar restaurante
          </button>

          <button @click="showCouponForm = !showCouponForm">
            🎟️ Criar cupom
          </button>
        </section>

        <!-- Formulário para editar os dados do restaurante -->
        <section v-if="showEditForm" class="panel-card">
          <h2>Editar restaurante</h2>

          <form @submit.prevent="handleUpdateBusiness">
            <label>Nome do restaurante</label>
            <input v-model="editBusinessName" required />

            <label>Descrição</label>
            <textarea
              v-model="editDescription"
              placeholder="Conte sobre o restaurante"
            />

            <label>Endereço</label>
            <input v-model="editAddress" placeholder="Rua, número, bairro" />

            <label>Cidade</label>
            <input v-model="editCity" placeholder="Exemplo: Fortaleza" />
            <label>Site oficial</label>

            <input
              v-model="editWebsite"
              placeholder="https://www.restaurante.com.br"
            />

            <label>Horário de funcionamento</label>
            <input
              v-model="editOpeningHours"
              placeholder="Exemplo: Terça a domingo, 18h às 23h"
            />

            <p v-if="editError" class="error-text">
              {{ editError }}
            </p>

            <button type="submit" :disabled="savingBusiness">
              {{ savingBusiness ? "Salvando..." : "Salvar alterações" }}
            </button>
          </form>
        </section>

        <!-- Formulário para criar cupom -->
        <section v-if="showCouponForm" class="panel-card">
          <h2>Criar cupom</h2>

          <form @submit.prevent="handleCreateCoupon">
            <label>Título</label>
            <input
              v-model="couponTitle"
              placeholder="Ex: 10% OFF no combo"
              required
            />

            <label>Código</label>
            <input v-model="couponCode" placeholder="FOOD10" required />

            <label>Descrição</label>
            <textarea
              v-model="couponDescription"
              placeholder="Descreva a promoção"
            />

            <label>Tipo de desconto</label>

            <select v-model="couponDiscountType">
              <option value="PERCENTAGE">Percentual</option>
              <option value="FIXED">Valor fixo</option>
              <option value="FREE_ITEM">Item grátis</option>
            </select>

            <label>Valor do desconto</label>
            <input v-model.number="couponDiscountValue" type="number" min="0" />

            <label>Validade</label>
            <input v-model="couponValidUntil" type="date" />

            <button type="submit" :disabled="savingCoupon">
              {{ savingCoupon ? "Criando..." : "Criar cupom" }}
            </button>
          </form>
        </section>

        <!-- Lista de cupons já cadastrados -->
        <section v-if="coupons.length" class="panel-card">
          <h2>Cupons cadastrados</h2>

          <article
            v-for="coupon in coupons"
            :key="coupon.id"
            class="coupon-card"
          >
            <strong>{{ coupon.title }}</strong>

            <p>{{ coupon.code }}</p>

            <p v-if="coupon.description">
              {{ coupon.description }}
            </p>

            <button @click="toggleCouponStatus(coupon.id)">
              {{ coupon.isActive ? "Desativar" : "Ativar" }}
            </button>
          </article>
        </section>

        <!-- Galeria horizontal com imagens das postagens do restaurante -->
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

        <!-- Lista de postagens relacionadas ao restaurante -->
        <section>
          <h2>Postagens do restaurante</h2>

          <p v-if="posts.length === 0" class="status">
            Nenhuma postagem encontrada para este restaurante.
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
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import PostCard from "../components/PostCard.vue";

import {
  getBusinessCoupons,
  getBusinessPosts,
  getMyBusiness,
  updateBusinessImages,
  updateMyBusiness,
  getBusinessFollowersCount,
} from "../services/businessService";

import { uploadFile } from "../services/uploadService";
import { createCoupon, toggleCoupon } from "../services/couponService";

import type { BusinessProfile, Coupon } from "../types/Business";
import type { Post } from "../types/Post";

import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

/*
  Estados básicos da tela.
*/
const loading = ref(true);
const error = ref("");

/*
  Dados principais do restaurante.
*/
const business = ref<BusinessProfile | null>(null);
const posts = ref<Post[]>([]);
const coupons = ref<Coupon[]>([]);
const followersCount = ref(0);

/*
  Controlam abertura e fechamento dos formulários.
*/
const showEditForm = ref(false);
const showCouponForm = ref(false);

/*
  Controla o popup da foto de perfil.
*/
const showAvatarModal = ref(false);

/*
  Referência para o input escondido de upload da foto.
*/
const avatarInput = ref<HTMLInputElement | null>(null);

/*
  Campos do formulário de cupom.
*/
const couponTitle = ref("");
const couponDescription = ref("");
const couponCode = ref("");

const couponDiscountType = ref<"PERCENTAGE" | "FIXED" | "FREE_ITEM">(
  "PERCENTAGE",
);

const couponDiscountValue = ref<number | undefined>();
const couponValidUntil = ref("");
const savingCoupon = ref(false);

/*
  Estados do formulário de edição do restaurante.
*/
const savingBusiness = ref(false);
const editError = ref("");

const editBusinessName = ref("");
const editDescription = ref("");
const editAddress = ref("");
const editCity = ref("");
const editWebsite = ref("");
const editOpeningHours = ref("");

/*
  Estados de upload.
*/
const uploadingAvatar = ref(false);
const uploadingCover = ref(false);

/*
  Calcula a nota média do restaurante com base nas postagens avaliadas.
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
  Filtra apenas postagens que possuem foto.
*/
const galleryPosts = computed(() => {
  return posts.value.filter((post) => {
    return post.medias?.[0] && post.medias[0].mediaType === "PHOTO";
  });
});

/*
  Carrega todos os dados do painel.
*/
async function loadDashboard() {
  try {
    loading.value = true;
    error.value = "";

    const businessData = await getMyBusiness();

    business.value = businessData;

    const [postsData, couponsData, followersData] = await Promise.all([
      getBusinessPosts(businessData.id),
      getBusinessCoupons(businessData.id),
      getBusinessFollowersCount(businessData.id),
    ]);

    posts.value = postsData.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    coupons.value = couponsData.filter((coupon) => coupon.isActive);

    followersCount.value = followersData.followersCount || 0;

    fillEditForm();
  } catch {
    error.value = "Erro ao carregar painel do restaurante.";
  } finally {
    loading.value = false;
  }
}

/*
  Preenche o formulário de edição com os dados atuais do restaurante.
*/
function fillEditForm() {
  if (!business.value) {
    return;
  }

  editBusinessName.value = business.value.businessName;
  editDescription.value = business.value.description || "";
  editAddress.value = business.value.address || "";
  editCity.value = business.value.city || "";
  editWebsite.value = business.value.website || "";
  editOpeningHours.value = business.value.openingHours || "";
}

/*
  Salva alterações textuais do restaurante no banco.
*/
async function handleUpdateBusiness() {
  try {
    if (!business.value) {
      return;
    }

    savingBusiness.value = true;
    editError.value = "";

    const updated = await updateMyBusiness({
      businessName: editBusinessName.value,
      description: editDescription.value,
      address: editAddress.value,
      city: editCity.value,
      website: editWebsite.value,
      openingHours: editOpeningHours.value,
    });

    business.value = {
      ...business.value,
      ...updated,
    };

    showEditForm.value = false;

    alert("Restaurante atualizado com sucesso.");
  } catch {
    editError.value = "Erro ao salvar alterações.";
  } finally {
    savingBusiness.value = false;
  }
}

/*
  Abre o seletor de arquivos escondido.
*/
function openAvatarFilePicker() {
  avatarInput.value?.click();
}

/*
  Troca a foto/logo do restaurante.
*/
async function handleAvatarUpload(event: Event) {
  try {
    if (!business.value) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    uploadingAvatar.value = true;

    const uploaded = await uploadFile(file);

    const updated = await updateBusinessImages({
      avatarUrl: uploaded.url,
    });

    business.value = {
      ...business.value,
      avatarUrl: updated.avatarUrl,
    };

    showAvatarModal.value = false;

    input.value = "";
  } catch {
    alert("Erro ao trocar foto do restaurante.");
  } finally {
    uploadingAvatar.value = false;
  }
}

/*
  Remove a foto atual do restaurante.
*/
async function handleRemoveAvatar() {
  try {
    if (!business.value) {
      return;
    }

    const updated = await updateBusinessImages({
      avatarUrl: "",
    });

    business.value = {
      ...business.value,
      avatarUrl: updated.avatarUrl,
    };

    showAvatarModal.value = false;
  } catch {
    alert("Erro ao remover foto.");
  }
}

/*
  Troca a capa do restaurante.
*/
async function handleCoverUpload(event: Event) {
  try {
    if (!business.value) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    uploadingCover.value = true;

    const uploaded = await uploadFile(file);

    const updated = await updateBusinessImages({
      coverUrl: uploaded.url,
    });

    business.value = {
      ...business.value,
      coverUrl: updated.coverUrl,
    };

    input.value = "";
  } catch {
    alert("Erro ao trocar capa do restaurante.");
  } finally {
    uploadingCover.value = false;
  }
}

/*
  Abre a página pública do restaurante.
*/
function goToPublicPage() {
  if (!business.value) {
    return;
  }

  router.push(`/restaurantes/${business.value.id}`);
}

/*
  Rola até a postagem correspondente à imagem clicada na galeria.
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

/*
  Faz logout e volta para a tela de login.
*/
function handleLogout() {
  authStore.logout();
  router.push("/login");
}

/*
  Cria um novo cupom para o restaurante logado.
*/
async function handleCreateCoupon() {
  try {
    if (!business.value) {
      return;
    }

    savingCoupon.value = true;

    const coupon = await createCoupon({
      businessProfileId: business.value.id,
      title: couponTitle.value,
      description: couponDescription.value,
      code: couponCode.value,
      discountType: couponDiscountType.value,
      discountValue: couponDiscountValue.value,
      validUntil: couponValidUntil.value || undefined,
    });

    coupons.value.unshift(coupon);

    couponTitle.value = "";
    couponDescription.value = "";
    couponCode.value = "";
    couponDiscountValue.value = undefined;
    couponValidUntil.value = "";

    showCouponForm.value = false;

    alert("Cupom criado com sucesso.");
  } catch {
    alert("Erro ao criar cupom.");
  } finally {
    savingCoupon.value = false;
  }
}

/*
  Ativa ou desativa um cupom existente.
*/
async function toggleCouponStatus(couponId: string) {
  try {
    const updated = await toggleCoupon(couponId);

    const index = coupons.value.findIndex((coupon) => coupon.id === couponId);

    if (index >= 0) {
      coupons.value[index] = updated;
    }
  } catch {
    alert("Erro ao atualizar cupom.");
  }
}

/*
  Quando a página abre, carregamos o painel.
*/
onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.business-dashboard {
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
  height: 150px;
  background: linear-gradient(135deg, #ff6b35, #ff8f5c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-actions {
  padding: 10px 16px 0;
  display: flex;
  justify-content: flex-end;
}

.business-header {
  padding: 16px 20px 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.avatar-area {
  min-width: 90px;
}

.business-avatar {
  width: 76px;
  height: 76px;
  min-width: 76px;
  min-height: 76px;
  border: none;
  border-radius: 50%;
  background: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  overflow: hidden;
  padding: 0;
}

.avatar-clickable {
  cursor: pointer;
}

.avatar-clickable:hover {
  opacity: 0.85;
}

.business-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-info {
  flex: 1;
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

.image-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff6b35;
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stats div {
  background: white;
  padding: 14px;
  border-radius: 12px;
  text-align: center;
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

.actions-panel {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.actions-panel button,
.panel-card button {
  width: 100%;
  border: none;
  border-radius: 12px;
  background: #ff6b35;
  color: white;
  padding: 12px;
  cursor: pointer;
  font-weight: bold;
}

.panel-card {
  background: white;
  padding: 18px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
}

.panel-card h2 {
  margin-bottom: 14px;
}

.panel-card form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-card label {
  font-weight: bold;
}

.panel-card input,
.panel-card textarea,
.panel-card select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: inherit;
}

.panel-card textarea {
  min-height: 90px;
  resize: vertical;
}

.error-text {
  color: red;
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

.post-anchor {
  scroll-margin-top: 20px;
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
  margin: 20px 0 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

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

@media (min-width: 600px) {
  .actions-panel {
    grid-template-columns: repeat(3, 1fr);
  }
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

.logout-button {
  display: block;
  margin-left: auto;
  margin-bottom: 10px;
  border: none;
  border-radius: 999px;
  background: #222;
  color: white;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}
.website-link {
  display: inline-block;
  margin-top: 6px;

  color: #1976d2;
  font-weight: bold;
  text-decoration: none;
}

.website-link:hover {
  text-decoration: underline;
}
</style>
