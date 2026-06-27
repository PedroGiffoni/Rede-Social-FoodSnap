<template>
  <main class="register-container">
    <div class="register-card">
      <h1>🍔 Criar conta</h1>

      <p class="subtitle">Entre para o FoodSnap</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="name" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" required />
        </div>

        <div class="form-group">
          <label>Cidade</label>
          <input v-model="city" placeholder="Exemplo: Fortaleza" />
        </div>

        <div class="form-group">
          <label>Tipo de usuário</label>
          <select v-model="userType">
            <option value="COMMON">Usuário comum</option>
            <option value="INFLUENCER">Influenciador</option>
            <option value="BUSINESS">Restaurante/empresa</option>
          </select>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Criando..." : "Criar conta" }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="login-link">
        Já tem conta?
        <RouterLink to="/login">Entrar</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { api } from "../api/api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const city = ref("");
const userType = ref<"COMMON" | "INFLUENCER" | "BUSINESS">("COMMON");

const loading = ref(false);
const error = ref("");

async function handleRegister() {
  try {
    loading.value = true;
    error.value = "";

    await api.post("/users", {
      name: name.value,
      email: email.value,
      password: password.value,
      city: city.value,
      userType: userType.value,
    });

    router.push("/login");
  } catch {
    error.value = "Erro ao criar conta. Verifique os dados.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.register-card {
  width: 400px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
}

h1,
.subtitle {
  text-align: center;
}

.subtitle {
  margin-bottom: 25px;
  color: #666;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

input,
select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #ff6b35;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}

.login-link {
  text-align: center;
  margin-top: 18px;
}

.login-link a {
  color: #ff6b35;
  font-weight: bold;
}
</style>
