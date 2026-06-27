import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import FeedPage from "../pages/FeedPage.vue";
import SearchPage from "../pages/SearchPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import CreatePostPage from "../pages/CreatePostPage.vue";
import BusinessProfilePage from "../pages/BusinessProfilePage.vue";
import UserProfilePage from "../pages/UserProfilePage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import BusinessDashboardPage from "../pages/BusinessDashboardPage.vue";
import NotificationsPage from "../pages/NotificationsPage.vue";
/*
  Configuração de rotas do FoodSnap.
*/

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/feed",
      component: FeedPage,
    },
    {
      path: "/buscar",
      component: SearchPage,
    },
    {
      path: "/perfil",
      component: ProfilePage,
    },
    {
      path: "/criar-post",
      component: CreatePostPage,
    },
    {
      path: "/restaurantes/:id",
      component: BusinessProfilePage,
    },
    {
      path: "/usuarios/:id",
      component: UserProfilePage,
    },
    {
      path: "/cadastro",
      component: RegisterPage,
    },
    {
      path: "/business-dashboard",
      component: BusinessDashboardPage,
    },
    {
      path: "/notificacoes",
      component: NotificationsPage,
    },
  ],
});
