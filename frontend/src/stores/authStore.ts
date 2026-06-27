import { defineStore } from "pinia";
import { api } from "../api/api";

/*
  authStore

  Guarda o estado de autenticação do usuário.
*/

interface User {
  id: string;
  name: string;
  email: string;
  userType: "COMMON" | "INFLUENCER" | "BUSINESS";

  city?: string;
  bio?: string;

  avatarUrl?: string | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(
      localStorage.getItem("foodsnap:user") || "null",
    ) as User | null,

    token: localStorage.getItem("foodsnap:token") as string | null,
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      this.user = response.data.user;
      this.token = response.data.token;

      localStorage.setItem("foodsnap:user", JSON.stringify(this.user));

      localStorage.setItem("foodsnap:token", this.token);

      api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    },

    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("foodsnap:user");
      localStorage.removeItem("foodsnap:token");

      delete api.defaults.headers.common.Authorization;
    },

    loadToken() {
      if (this.token) {
        api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      }
    },

    /*
      Atualiza os dados do usuário logado.

      Utilizado após:
      - troca de foto
      - edição de perfil
    */
    updateUser(user: User) {
      this.user = user;

      localStorage.setItem("foodsnap:user", JSON.stringify(user));
    },
  },
});
