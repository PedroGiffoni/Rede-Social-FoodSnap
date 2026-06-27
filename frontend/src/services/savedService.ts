import { api } from "../api/api";

/*
  savedService

  Responsável por buscar e salvar itens do usuário logado.
*/

export async function getSavedPosts() {
  const response = await api.get("/saved/posts");

  return response.data;
}

export async function getSavedBusinesses() {
  const response = await api.get("/saved/businesses");

  return response.data;
}

/*
  Salva ou remove uma postagem dos favoritos.
*/
export async function toggleSavedPost(postId: string) {
  const response = await api.post(`/saved/posts/${postId}`);

  return response.data;
}
/*
  Salva ou remove restaurante dos favoritos.
*/
export async function toggleSavedBusiness(businessId: string) {
  const response = await api.post(`/saved/businesses/${businessId}`);

  return response.data;
}
