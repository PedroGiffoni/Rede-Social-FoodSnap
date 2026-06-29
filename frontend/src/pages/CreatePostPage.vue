<template>
  <MainLayout>
    <main class="create-page">
      <h1>{{ isBusinessUser ? "Criar publicação" : "Criar avaliação" }}</h1>

      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <label>Foto ou vídeo</label>

          <input
            type="file"
            accept="image/*,video/*"
            @change="handleFileChange"
          />

          <p v-if="selectedFile" class="helper">
            Arquivo selecionado: {{ selectedFile.name }}
          </p>
        </div>

        <div v-if="!isBusinessUser" class="field">
          <label>Nome do restaurante</label>

          <input
            v-model="businessName"
            placeholder="Exemplo: Seu Burger"
            required
          />
        </div>

        <div v-else class="business-notice">
          Publicando como restaurante:
          <strong>{{ myBusiness?.businessName }}</strong>
        </div>

        <div class="field">
          <label>Título</label>

          <input
            v-model="title"
            :placeholder="
              isBusinessUser
                ? 'Exemplo: Promoção especial de hoje'
                : 'Exemplo: Smash burger excelente'
            "
            required
          />
        </div>

        <div class="field">
          <label>Descrição</label>

          <textarea
            v-model="description"
            :placeholder="
              isBusinessUser
                ? 'Conte sobre a promoção, novidade ou divulgação'
                : 'Conte como foi sua experiência'
            "
            required
          />
        </div>

        <section v-if="!isBusinessUser" class="ratings">
          <h2>Avaliação</h2>

          <div class="field">
            <label>Indicaria este local? {{ recommendationRating }}</label>
            <input
              v-model.number="recommendationRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          <div class="field">
            <label>Preço {{ priceRating }}</label>
            <input
              v-model.number="priceRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          <div class="field">
            <label>Sabor {{ flavorRating }}</label>
            <input
              v-model.number="flavorRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          <div class="field">
            <label>Apresentação {{ presentationRating }}</label>
            <input
              v-model.number="presentationRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>
          <div class="field">
            <label>Atendimento {{ serviceRating }}</label>
            <input
              v-model.number="serviceRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          <div class="field">
            <label>Ambiente {{ environmentRating }}</label>
            <input
              v-model.number="environmentRating"
              type="range"
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </section>

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Publicando..." : "Publicar" }}
        </button>
      </form>
    </main>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

import { uploadFile } from "../services/uploadService";
import { createPost } from "../services/postService";
import { getMyBusiness } from "../services/businessService";

import { useAuthStore } from "../stores/authStore";
import type { BusinessProfile } from "../types/Business";

const router = useRouter();
const authStore = useAuthStore();

const selectedFile = ref<File | null>(null);

const myBusiness = ref<BusinessProfile | null>(null);

const businessName = ref("");
const title = ref("");
const description = ref("");

const recommendationRating = ref(4.5);
const priceRating = ref(4.5);
const flavorRating = ref(4.5);
const presentationRating = ref(4.5);
const serviceRating = ref(4.5);
const environmentRating = ref(4.5);

const loading = ref(false);
const error = ref("");

const isBusinessUser = computed(() => {
  return authStore.user?.userType === "BUSINESS";
});

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  }
}

async function loadBusinessIfNeeded() {
  if (!isBusinessUser.value) {
    return;
  }

  myBusiness.value = await getMyBusiness();
}

async function handleSubmit() {
  try {
    error.value = "";

    if (!selectedFile.value) {
      error.value = "Selecione uma foto ou vídeo.";
      return;
    }

    if (isBusinessUser.value && !myBusiness.value) {
      error.value = "Restaurante vinculado não encontrado.";
      return;
    }

    loading.value = true;

    const uploaded = await uploadFile(selectedFile.value);

    const mediaType = uploaded.resourceType === "video" ? "VIDEO" : "PHOTO";

    if (isBusinessUser.value) {
      await createPost({
        businessProfileId: myBusiness.value?.id,
        postType: "PROMOTION",
        title: title.value,
        description: description.value,
        medias: [
          {
            mediaUrl: uploaded.url,
            mediaType,
          },
        ],
      });

      router.push("/business-dashboard");
      return;
    }

    await createPost({
      businessName: businessName.value,
      postType: "REVIEW",
      title: title.value,
      description: description.value,
      recommendationRating: recommendationRating.value,
      priceRating: priceRating.value,
      flavorRating: flavorRating.value,
      presentationRating: presentationRating.value,
      serviceRating: serviceRating.value,
      environmentRating: environmentRating.value,
      medias: [
        {
          mediaUrl: uploaded.url,
          mediaType,
        },
      ],
    });

    router.push("/feed");
  } catch {
    error.value = "Erro ao publicar. Verifique os dados e tente novamente.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadBusinessIfNeeded();
});
</script>

<style scoped>
.create-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 18px;
}

.form {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 6px;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: inherit;
}

textarea {
  min-height: 110px;
  resize: vertical;
}

.helper {
  margin-top: 6px;
  color: #666;
  font-size: 14px;
}

.business-notice {
  background: #fff3ed;
  color: #444;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.ratings {
  margin-top: 20px;
}

.ratings h2 {
  margin-bottom: 12px;
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #ff6b35;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-bottom: 12px;
}
</style>
