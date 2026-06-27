import { api } from "../api/api";
import type { GlobalSearchResult } from "../types/Search";
import type { Post } from "../types/Post";

/*
  searchService

  Responsável por conversar com os endpoints de busca do backend.
*/

export async function globalSearch(term: string) {
  const response = await api.get<GlobalSearchResult>("/search", {
    params: {
      term,
    },
  });

  return response.data;
}

export async function getExplorePosts() {
  const response = await api.get<Post[]>("/posts/explore");

  return response.data;
}

export async function getTopRestaurants() {
  const response = await api.get("/ranking/restaurants");

  return response.data;
}
