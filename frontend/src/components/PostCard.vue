<template>
  <article class="post-card">
    <header class="post-header">
      <div class="avatar clickable" @click="goToUserProfile">
        <img
          v-if="displayAvatarUrl"
          :src="displayAvatarUrl"
          :alt="localPost.author.name"
        />

        <span v-else>
          {{ localPost.author.name.charAt(0).toUpperCase() }}
        </span>
      </div>

      <div>
        <strong class="clickable author-name" @click="goToUserProfile">
          {{ localPost.author.name }}
        </strong>

        <p
          v-if="localPost.businessProfile"
          class="clickable business-name"
          @click="goToBusinessProfile"
        >
          {{ localPost.businessProfile.businessName }}
        </p>

        <p v-else>Restaurante não informado</p>
      </div>
    </header>

    <div v-if="mainMedia" class="media-wrapper">
      <img
        v-if="mainMedia.mediaType === 'PHOTO'"
        :src="mainMedia.mediaUrl"
        :alt="localPost.title"
      />

      <video v-else :src="mainMedia.mediaUrl" controls />
    </div>

    <section class="post-content">
      <section v-if="editing" class="edit-area">
        <h3>Editar postagem</h3>

        <form @submit.prevent="handleUpdatePost">
          <label>Título</label>
          <input v-model="editTitle" required />

          <label>Descrição</label>
          <textarea v-model="editDescription" required />

          <label>Indicaria? {{ editRecommendationRating }}</label>
          <input
            v-model.number="editRecommendationRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />

          <label>Preço {{ editPriceRating }}</label>
          <input
            v-model.number="editPriceRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />

          <label>Sabor {{ editFlavorRating }}</label>
          <input
            v-model.number="editFlavorRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />

          <label>Apresentação {{ editPresentationRating }}</label>
          <input
            v-model.number="editPresentationRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />
          <label>Atendimento {{ editServiceRating }}</label>
          <input
            v-model.number="editServiceRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />

          <label>Ambiente {{ editEnvironmentRating }}</label>
          <input
            v-model.number="editEnvironmentRating"
            type="range"
            min="1"
            max="5"
            step="0.1"
          />

          <div class="edit-actions">
            <button type="submit" :disabled="savingEdit">
              {{ savingEdit ? "Salvando..." : "Salvar" }}
            </button>

            <button type="button" class="cancel-button" @click="cancelEdit">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <template v-else>
        <div class="rating" v-if="localPost.averageRating">
          ⭐ {{ Number(localPost.averageRating).toFixed(1) }}
        </div>

        <h2>{{ localPost.title }}</h2>

        <p>{{ localPost.description }}</p>

        <div class="details" v-if="localPost.postType === 'REVIEW'">
          <span>Indicaria: {{ localPost.recommendationRating }}</span>
          <span>Preço: {{ localPost.priceRating }}</span>
          <span>Sabor: {{ localPost.flavorRating }}</span>
          <span>Apresentação: {{ localPost.presentationRating }}</span>
          <span>Atendimento: {{ localPost.serviceRating }}</span>
          <span>Ambiente: {{ localPost.environmentRating }}</span>
        </div>
      </template>

      <footer class="actions">
        <button v-if="isOwner" class="edit-button" @click="openEditForm">
          ✏️ Editar
        </button>

        <button v-if="isOwner" class="delete-button" @click="handleDeletePost">
          🗑️ Excluir
        </button>

        <button @click="handleLike">❤️ {{ likesCount }}</button>

        <button @click="toggleComments">💬 {{ comments.length }}</button>

        <button @click="handleSave">⭐ {{ saved ? "Salvo" : "Salvar" }}</button>
      </footer>

      <section v-if="showComments" class="comments-area">
        <form @submit.prevent="handleComment">
          <input v-model="newComment" placeholder="Escreva um comentário..." />
          <button type="submit">Enviar</button>
        </form>

        <div v-for="comment in comments" :key="comment.id" class="comment">
          <strong
            v-if="comment.user?.id"
            class="clickable comment-author"
            @click="goToCommentAuthorProfile(comment.user.id)"
          >
            {{ comment.user.name }}
          </strong>

          <strong v-else>Usuário</strong>

          <p>{{ comment.content }}</p>
        </div>
      </section>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

import type { Post } from "../types/Post";

import { toggleLike } from "../services/likeService";
import { toggleSavedPost } from "../services/savedService";
import { createComment } from "../services/commentService";
import { deletePost, updatePost } from "../services/postService";

/*
  PostCard

  Card visual e interativo de uma postagem.

  Permite:
  - abrir perfil público
  - abrir restaurante
  - curtir
  - salvar
  - comentar
  - excluir postagem própria
  - editar postagem própria
*/

const props = defineProps<{
  post: Post;
}>();

const emit = defineEmits<{
  deleted: [string];
}>();

const router = useRouter();
const authStore = useAuthStore();

/*
  Cópia local do post.

  Assim conseguimos atualizar o card imediatamente
  após editar, sem recarregar a página.
*/
const localPost = ref<Post>({ ...props.post });

const mainMedia = computed(() => {
  return localPost.value.medias?.[0];
});

const isOwner = computed(() => {
  return authStore.user?.id === localPost.value.author.id;
});

const likesCount = ref(localPost.value.likes.length);
const comments = ref<any[]>([...localPost.value.comments]);

const saved = ref(false);
const showComments = ref(false);
const newComment = ref("");

const editing = ref(false);
const savingEdit = ref(false);

const editTitle = ref("");
const editDescription = ref("");
const editRecommendationRating = ref(4.5);
const editPriceRating = ref(4.5);
const editFlavorRating = ref(4.5);
const editPresentationRating = ref(4.5);
const editServiceRating = ref(4.5);
const editEnvironmentRating = ref(4.5);
const displayAvatarUrl = computed(() => {
  if (
    localPost.value.author.userType === "BUSINESS" &&
    localPost.value.businessProfile?.avatarUrl
  ) {
    return localPost.value.businessProfile.avatarUrl;
  }

  return localPost.value.author.avatarUrl;
});
function goToUserProfile() {
  if (
    localPost.value.author.userType === "BUSINESS" &&
    localPost.value.businessProfile?.id
  ) {
    router.push(`/restaurantes/${localPost.value.businessProfile.id}`);
    return;
  }

  router.push(`/usuarios/${localPost.value.author.id}`);
}

function goToBusinessProfile() {
  if (!localPost.value.businessProfile) {
    return;
  }

  router.push(`/restaurantes/${localPost.value.businessProfile.id}`);
}

function goToCommentAuthorProfile(userId: string) {
  router.push(`/usuarios/${userId}`);
}

async function handleLike() {
  const result = await toggleLike(localPost.value.id);
  likesCount.value = result.likesCount;
}

async function handleSave() {
  const result = await toggleSavedPost(localPost.value.id);
  saved.value = result.saved;
}

async function handleDeletePost() {
  const confirmed = window.confirm("Deseja realmente excluir esta postagem?");

  if (!confirmed) {
    return;
  }

  try {
    await deletePost(localPost.value.id);
    emit("deleted", localPost.value.id);
  } catch {
    alert("Erro ao excluir postagem.");
  }
}

/*
  Abre o formulário de edição com os dados atuais do post.
*/
function openEditForm() {
  editTitle.value = localPost.value.title;
  editDescription.value = localPost.value.description;

  editRecommendationRating.value = Number(
    localPost.value.recommendationRating ?? 4.5,
  );
  editPriceRating.value = Number(localPost.value.priceRating ?? 4.5);
  editFlavorRating.value = Number(localPost.value.flavorRating ?? 4.5);
  editPresentationRating.value = Number(
    localPost.value.presentationRating ?? 4.5,
  );
  editServiceRating.value = Number(localPost.value.serviceRating ?? 4.5);
  editEnvironmentRating.value = Number(
    localPost.value.environmentRating ?? 4.5,
  );

  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
}

/*
  Salva alterações da postagem no backend
  e atualiza o card imediatamente.
*/
async function handleUpdatePost() {
  try {
    savingEdit.value = true;

    const updatedPost = await updatePost(localPost.value.id, {
      title: editTitle.value,
      description: editDescription.value,
      recommendationRating: editRecommendationRating.value,
      priceRating: editPriceRating.value,
      flavorRating: editFlavorRating.value,
      presentationRating: editPresentationRating.value,
      serviceRating: editServiceRating.value,
      environmentRating: editEnvironmentRating.value,
    });

    localPost.value = updatedPost;
    comments.value = [...updatedPost.comments];
    likesCount.value = updatedPost.likes.length;

    editing.value = false;
  } catch {
    alert("Erro ao editar postagem.");
  } finally {
    savingEdit.value = false;
  }
}

function toggleComments() {
  showComments.value = !showComments.value;
}

async function handleComment() {
  if (!newComment.value.trim()) {
    return;
  }

  const comment = await createComment(localPost.value.id, newComment.value);

  comments.value.push(comment);
  newComment.value = "";
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.08);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.avatar {
  width: 42px;
  height: 42px;
  min-width: 42px;
  min-height: 42px;
  border-radius: 50%;
  overflow: hidden;
  background: #ff6b35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.author-name {
  display: inline-block;
}

.business-name {
  color: #666;
  font-size: 14px;
}

.post-header p {
  color: #666;
  font-size: 14px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: #ff6b35;
}

.media-wrapper {
  width: 100%;
  background: #eee;
}

.media-wrapper img,
.media-wrapper video {
  width: 100%;
  display: block;
  max-height: 520px;
  object-fit: cover;
}

.post-content {
  padding: 14px;
}

.rating {
  color: #ff6b35;
  font-weight: bold;
  margin-bottom: 8px;
}

h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.post-content p {
  color: #444;
  line-height: 1.4;
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  color: #555;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.actions button {
  border: none;
  background: #f1f1f1;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
}

.actions button:hover {
  background: #ffe1d5;
}

.edit-button {
  background: #fff3e8 !important;
  color: #ff6b35;
  font-weight: bold;
}

.delete-button {
  background: #ffeded !important;
  color: #d60000;
  font-weight: bold;
}

.delete-button:hover {
  background: #ffd5d5 !important;
}

.edit-area {
  background: #fff7f2;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 14px;
}

.edit-area h3 {
  margin-bottom: 12px;
}

.edit-area form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-area input,
.edit-area textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: inherit;
}

.edit-area textarea {
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

.edit-actions .cancel-button {
  background: #222;
}

.comments-area {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.comments-area form {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.comments-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 999px;
}

.comments-area form button {
  border: none;
  background: #ff6b35;
  color: white;
  border-radius: 999px;
  padding: 0 14px;
  cursor: pointer;
}

.comment {
  background: #f7f7f7;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
}

.comment strong {
  font-size: 14px;
}

.comment-author {
  cursor: pointer;
}

.comment-author:hover {
  color: #ff6b35;
}

.comment p {
  margin-top: 4px;
}
</style>
