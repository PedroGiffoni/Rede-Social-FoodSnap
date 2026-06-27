import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { router } from "./router";
import { useAuthStore } from "./stores/authStore";
import "./style.css";

/*
  main.ts

  Arquivo de entrada do frontend.
*/

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

/*
  Recarrega o token salvo no localStorage para o Axios.
  Sem isso, ao atualizar a página, as rotas protegidas podem falhar.
*/
const authStore = useAuthStore();
authStore.loadToken();

app.mount("#app");
