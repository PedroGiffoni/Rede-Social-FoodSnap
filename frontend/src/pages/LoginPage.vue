<template>
  <main class="login-container">
    <div class="login-card">
      <h1>🍔 FoodSnap</h1>

      <p class="subtitle">Descubra os melhores restaurantes da sua cidade</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>

          <input
            v-model="email"
            type="email"
            placeholder="Digite seu email"
            required
          />
        </div>

        <div class="form-group">
          <label>Senha</label>

          <input
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <p class="register-link">
        Ainda não tem conta?
        <RouterLink to="/cadastro">Cadastre-se</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/authStore";

/*
  Tela de Login.

  Objetivo:
  - autenticar usuário
  - salvar token
  - redirecionar para o feed
*/

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

async function handleLogin() {
  try {
    loading.value = true;
    error.value = "";

    await authStore.login(email.value, password.value);

    router.push("/feed");
  } catch {
    error.value = "Email ou senha inválidos.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f5f5f5;
}

.login-card {
  width: 400px;

  background: white;

  padding: 30px;

  border-radius: 12px;

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  margin-bottom: 25px;
  color: #666;
}

.form-group {
  display: flex;
  flex-direction: column;

  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
}

input {
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

button:hover {
  background: #e95c29;
}

.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}
.register-link {
  text-align: center;
  margin-top: 18px;
  color: #666;
}

.register-link a {
  color: #ff6b35;
  font-weight: bold;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
