<template>
  <MainLayout>
    <main class="profile-page">
      <!-- Card principal do perfil do usuário logado -->
      <section class="profile-card" v-if="authStore.user">
        <!-- Botão de logout -->
        <button class="logout-button" @click="handleLogout">Sair</button>

        <!-- Botão para abrir formulário de edição textual do perfil -->
        <button class="edit-button" @click="openEditForm">
          ✏️ Editar perfil
        </button>

        <!-- Área do avatar -->
        <div class="avatar-area">
          <!--
            A própria foto agora é clicável.

            Ao clicar:
            - abre popup
            - permite carregar foto
            - permite excluir foto atual
            - permite cancelar
          -->
          <button
            class="avatar avatar-clickable"
            @click="showAvatarModal = true"
          >
            <img
              v-if="authStore.user.avatarUrl"
              :src="authStore.user.avatarUrl"
              :alt="authStore.user.name"
            />

            <span v-else>
              {{ authStore.user.name.charAt(0).toUpperCase() }}
            </span>
          </button>

          <!--
            Input escondido.

            Ele é acionado pelo botão "Carregar foto" dentro do popup.
          -->
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            hidden
            :disabled="uploadingAvatar"
            @change="handleAvatarChange"
          />
        </div>

        <!-- Informações principais do perfil -->
        <div class="profile-info">
          <h1>{{ authStore.user.name }}</h1>

          <p class="username">@{{ username }}</p>

          <p v-if="authStore.user.bio" class="bio">
            {{ authStore.user.bio }}
          </p>
        </div>
      </section>

      <!-- Formulário de edição de nome, bio e cidade -->
      <section v-if="editingProfile" class="edit-card">
        <h2>Editar perfil</h2>

        <form @submit.prevent="handleUpdateProfile">
          <label>Nome</label>
          <input v-model="editName" required />

          <label>Bio</label>
          <textarea v-model="editBio" placeholder="Conte um pouco sobre você" />

          <label>Cidade</label>
          <input v-model="editCity" placeholder="Exemplo: Fortaleza" />

          <p v-if="profileError" class="avatar-error">
            {{ profileError }}
          </p>

          <div class="edit-actions">
            <button type="submit" :disabled="savingProfile">
              {{ savingProfile ? "Salvando..." : "Salvar" }}
            </button>

            <button
              type="button"
              class="cancel"
              @click="editingProfile = false"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Estatísticas principais do perfil -->
      <section class="stats">
        <div>
          <strong>{{ myPosts.length }}</strong>
          <span>Postagens</span>
        </div>

        <button class="stat-button" @click="openFollowersModal">
          <strong>{{ stats.followersCount }}</strong>
          <span>Seguidores</span>
        </button>

        <button class="stat-button" @click="openFollowingModal">
          <strong>{{ stats.followingCount }}</strong>
          <span>Seguindo</span>
        </button>

        <div>
          <strong>{{ savedPosts.length }}</strong>
          <span>Salvos</span>
        </div>
      </section>

      <!-- Mensagem de erro relacionada à foto -->
      <p v-if="avatarError" class="avatar-error">
        {{ avatarError }}
      </p>

      <!-- Abas do perfil -->
      <section class="tabs">
        <button
          :class="{ active: activeTab === 'myPosts' }"
          @click="activeTab = 'myPosts'"
        >
          📸 Minhas postagens
        </button>

        <button
          :class="{ active: activeTab === 'savedPosts' }"
          @click="activeTab = 'savedPosts'"
        >
          ⭐ Salvos
        </button>

        <button
          :class="{ active: activeTab === 'savedBusinesses' }"
          @click="activeTab = 'savedBusinesses'"
        >
          🍔 Restaurantes
        </button>
      </section>

      <!-- Estado de carregamento das listas -->
      <section v-if="loading" class="status">Carregando perfil...</section>

      <!-- Aba: minhas postagens -->
      <section v-else-if="activeTab === 'myPosts'">
        <h2>Minhas postagens</h2>

        <p v-if="myPosts.length === 0" class="status">
          Você ainda não criou nenhuma postagem.
        </p>

        <PostCard
          v-for="post in myPosts"
          :key="post.id"
          :post="post"
          @deleted="handlePostDeleted"
        />
      </section>

      <!-- Aba: posts salvos -->
      <section v-else-if="activeTab === 'savedPosts'">
        <h2>Posts salvos</h2>

        <p v-if="savedPosts.length === 0" class="status">
          Nenhum post salvo ainda.
        </p>

        <PostCard v-for="item in savedPosts" :key="item.id" :post="item.post" />
      </section>

      <!-- Aba: restaurantes salvos -->
      <section v-else>
        <h2>Restaurantes salvos</h2>

        <p v-if="savedBusinesses.length === 0" class="status">
          Nenhum restaurante salvo ainda.
        </p>

        <article
          v-for="item in savedBusinesses"
          :key="item.id"
          class="business-card"
        >
          <h3>{{ item.businessProfile.businessName }}</h3>

          <p>
            {{ item.businessProfile.city || "Cidade não informada" }}
          </p>

          <p v-if="item.businessProfile.isClaimed">✅ Perfil oficial</p>

          <p v-else>Perfil ainda não reivindicado</p>
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

          <button class="modal-option cancel" @click="showAvatarModal = false">
            Cancelar
          </button>
        </div>
      </section>
      <section
        v-if="showUsersModal"
        class="modal-overlay"
        @click.self="showUsersModal = false"
      >
        <div class="users-modal">
          <header class="modal-header">
            <h2>{{ usersModalTitle }}</h2>

            <button @click="showUsersModal = false">✕</button>
          </header>

          <section v-if="usersModalList.length === 0" class="modal-status">
            Nenhum usuário encontrado.
          </section>

          <section v-else>
            <article
              v-for="modalUser in usersModalList"
              :key="modalUser.id"
              class="modal-user-card"
              @click="goToUser(modalUser.id)"
            >
              <div class="modal-avatar">
                <img
                  v-if="modalUser.avatarUrl"
                  :src="modalUser.avatarUrl"
                  :alt="modalUser.name"
                />

                <span v-else>
                  {{ modalUser.name.charAt(0).toUpperCase() }}
                </span>
              </div>

              <div>
                <strong>{{ modalUser.name }}</strong>
                <p>@{{ makeUsername(modalUser.name) }}</p>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
/*
  Imports principais do Vue.

  computed:
  cria valores derivados automaticamente.

  onMounted:
  executa uma função quando a página abre.

  reactive:
  cria objeto reativo.

  ref:
  cria estados reativos simples.
*/
import { computed, onMounted, reactive, ref } from "vue";

/*
  useRouter permite navegar entre páginas.
*/
import { useRouter } from "vue-router";

/*
  Componentes usados nesta página.
*/
import MainLayout from "../layouts/MainLayout.vue";
import PostCard from "../components/PostCard.vue";

/*
  Store de autenticação.

  Guarda o usuário logado e permite:
  - atualizar dados do usuário
  - fazer logout
*/
import { useAuthStore } from "../stores/authStore";

/*
  Services usados para carregar dados do perfil.
*/
import { getSavedBusinesses, getSavedPosts } from "../services/savedService";
import {
  getFollowStats,
  getFollowers,
  getFollowing,
} from "../services/followService";
import { getPostsByUser } from "../services/postService";

/*
  Serviço de upload.

  Envia arquivo para backend/Cloudinary e retorna URL.
*/
import { uploadFile } from "../services/uploadService";

/*
  Services do usuário.

  updateMyAvatar:
  salva a nova URL da foto no usuário.

  updateMyProfile:
  salva nome, bio e cidade.
*/
import { updateMyAvatar, updateMyProfile } from "../services/userService";

/*
  Tipagem de post.
*/
import type { Post } from "../types/Post";

/*
  ProfilePage

  Tela do perfil do usuário logado.

  Permite:
  - ver dados do perfil
  - clicar na foto para abrir popup
  - carregar foto
  - excluir foto atual
  - editar nome, bio e cidade
  - ver postagens
  - ver posts salvos
  - ver restaurantes salvos
*/

const router = useRouter();
const authStore = useAuthStore();

/*
  Estados principais da tela.
*/
const loading = ref(true);
const uploadingAvatar = ref(false);
const savingProfile = ref(false);
const editingProfile = ref(false);

/*
  Controla abertura do popup da foto.
*/
const showAvatarModal = ref(false);

/*
  Referência ao input escondido de arquivo.
*/
const avatarInput = ref<HTMLInputElement | null>(null);

/*
  Mensagens de erro.
*/
const avatarError = ref("");
const profileError = ref("");

/*
  Campos do formulário de edição.
*/
const editName = ref("");
const editBio = ref("");
const editCity = ref("");

/*
  Aba ativa do perfil.
*/
const activeTab = ref<"myPosts" | "savedPosts" | "savedBusinesses">("myPosts");

/*
  Listas exibidas no perfil.
*/
const myPosts = ref<Post[]>([]);
const savedPosts = ref<any[]>([]);
const savedBusinesses = ref<any[]>([]);
const followers = ref<any[]>([]);
const followingUsers = ref<any[]>([]);

const showUsersModal = ref(false);
const usersModalTitle = ref("");
const usersModalList = ref<any[]>([]);

/*
  Estatísticas de seguidores.
*/
const stats = reactive({
  followersCount: 0,
  followingCount: 0,
});

/*
  Gera um username visual com base no nome.
*/
const username = computed(() => {
  if (!authStore.user) {
    return "";
  }

  return authStore.user.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
});

/*
  Carrega todos os dados do perfil do usuário logado.

  Fluxo:
  1. valida se existe usuário logado
  2. se for BUSINESS, manda para dashboard da empresa
  3. busca estatísticas
  4. busca postagens criadas
  5. busca posts salvos
  6. busca restaurantes salvos
*/
async function loadProfile() {
  if (!authStore.user) {
    router.push("/login");
    return;
  }

  if (authStore.user.userType === "BUSINESS") {
    router.push("/business-dashboard");
    return;
  }

  try {
    loading.value = true;

    const [
      followStats,
      postsCreatedByUser,
      postsSavedByUser,
      businesses,
      followersData,
      followingData,
    ] = await Promise.all([
      getFollowStats(authStore.user.id),
      getPostsByUser(authStore.user.id),
      getSavedPosts(),
      getSavedBusinesses(),
      getFollowers(authStore.user.id),
      getFollowing(authStore.user.id),
    ]);

    stats.followersCount = followStats.followersCount;
    stats.followingCount = followStats.followingCount;

    myPosts.value = postsCreatedByUser;
    savedPosts.value = postsSavedByUser;
    savedBusinesses.value = businesses;
    followers.value = followersData;
    followingUsers.value = followingData;
  } finally {
    loading.value = false;
  }
}

/*
  Abre o formulário de edição do perfil.
*/
function openEditForm() {
  if (!authStore.user) {
    return;
  }

  editName.value = authStore.user.name;
  editBio.value = authStore.user.bio || "";
  editCity.value = authStore.user.city || "";

  profileError.value = "";
  editingProfile.value = true;
}

/*
  Salva nome, bio e cidade.
*/
async function handleUpdateProfile() {
  try {
    savingProfile.value = true;
    profileError.value = "";

    const updatedUser = await updateMyProfile({
      name: editName.value,
      bio: editBio.value,
      city: editCity.value,
    });

    authStore.updateUser(updatedUser);
    editingProfile.value = false;
  } catch {
    profileError.value = "Erro ao atualizar perfil.";
  } finally {
    savingProfile.value = false;
  }
}

/*
  Abre o seletor de arquivos escondido.
*/
function openAvatarFilePicker() {
  avatarInput.value?.click();
}

function openFollowersModal() {
  usersModalTitle.value = "Seguidores";

  usersModalList.value = followers.value.map((item) => {
    return item.follower;
  });

  showUsersModal.value = true;
}

function openFollowingModal() {
  usersModalTitle.value = "Seguindo";

  usersModalList.value = followingUsers.value.map((item) => {
    return item.following;
  });

  showUsersModal.value = true;
}

function goToUser(userId: string) {
  showUsersModal.value = false;
  router.push(`/usuarios/${userId}`);
}

function makeUsername(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

/*
  Envia nova foto e atualiza o usuário logado.
*/
async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  try {
    uploadingAvatar.value = true;
    avatarError.value = "";

    const uploadedFile = await uploadFile(file);

    const updatedUser = await updateMyAvatar(uploadedFile.url);

    authStore.updateUser(updatedUser);

    showAvatarModal.value = false;
  } catch {
    avatarError.value = "Erro ao trocar foto. Tente novamente.";
  } finally {
    uploadingAvatar.value = false;
    input.value = "";
  }
}

/*
  Remove a foto atual do perfil.

  Envia string vazia para avatarUrl.
*/
async function handleRemoveAvatar() {
  try {
    uploadingAvatar.value = true;
    avatarError.value = "";

    const updatedUser = await updateMyAvatar("");

    authStore.updateUser(updatedUser);

    showAvatarModal.value = false;
  } catch {
    avatarError.value = "Erro ao remover foto. Tente novamente.";
  } finally {
    uploadingAvatar.value = false;
  }
}

/*
  Faz logout do usuário.
*/
function handleLogout() {
  authStore.logout();
  router.push("/login");
}

/*
  Remove a postagem da lista imediatamente
  quando ela é excluída no PostCard.
*/
function handlePostDeleted(postId: string) {
  myPosts.value = myPosts.value.filter((post) => post.id !== postId);
}

/*
  Carrega o perfil ao abrir a página.
*/
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card,
.edit-card {
  position: relative;
  background: white;
  padding: 24px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
}

.edit-card {
  display: block;
  margin-top: 16px;
}

.edit-card form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-card input,
.edit-card textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: inherit;
}

.edit-card textarea {
  min-height: 90px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.edit-actions button {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 12px;
  background: #ff6b35;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.edit-actions .cancel {
  background: #222;
}

.logout-button {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: #222;
  color: white;
  cursor: pointer;
  font-size: 13px;
}

.edit-button {
  position: absolute;
  top: 74px;
  right: 14px;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: #ff6b35;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

.avatar-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/*
  Avatar clicável.
*/
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

.avatar-clickable {
  cursor: pointer;
}

.avatar-clickable:hover {
  opacity: 0.85;
}

.avatar img,
.small-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-error {
  color: red;
  background: white;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 14px;
  text-align: center;
}

.profile-info h1 {
  font-size: 24px;
  margin-bottom: 4px;
}

.username,
.bio,
.city {
  color: #777;
  font-size: 15px;
}

.bio {
  margin-top: 6px;
  color: #444;
}

.stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stats div,
.stats .stat-button {
  background: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
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

.tabs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #eee;
  color: #333;
  cursor: pointer;
  font-weight: bold;
}

.tabs button.active {
  background: #ff6b35;
  color: white;
}

.status {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #666;
}

h2 {
  margin-bottom: 14px;
}

.business-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
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
  Botões do popup.
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

@media (min-width: 600px) {
  .tabs {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-button:hover {
  background: #fff3ed;
}

.users-modal {
  width: min(560px, calc(100% - 32px));
  max-height: 80vh;
  overflow-y: auto;
  background: #26272d;
  border-radius: 18px;
  color: white;
}

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

.modal-status {
  padding: 20px;
  text-align: center;
  color: #bbb;
}

.modal-user-card {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid #3a3b41;
}

.modal-user-card:hover {
  background: #32333a;
}

.modal-avatar {
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

.modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-user-card p {
  color: #bbb;
  font-size: 14px;
}
</style>
