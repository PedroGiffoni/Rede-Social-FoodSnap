import { api } from "../api/api";
import type { Post } from "../types/Post";

/*
  postService

  Responsável por conversar com os endpoints de postagens do backend.
*/

export async function getFeedPosts() {
  const response = await api.get<Post[]>("/posts");
  return response.data;
}

export async function getPostsByUser(userId: string) {
  const response = await api.get<Post[]>(`/posts/user/${userId}`);
  return response.data;
}

/*
  Cria uma nova postagem.

  Para postagens do tipo REVIEW, agora enviamos seis notas:
  - indicaria
  - preço
  - sabor
  - apresentação
  - atendimento
  - ambiente
*/
export async function createPost(data: {
  businessName?: string;
  businessProfileId?: string;
  postType: "REVIEW" | "PROMOTION" | "ADVERTISEMENT";
  title: string;
  description: string;
  recommendationRating?: number;
  priceRating?: number;
  flavorRating?: number;
  presentationRating?: number;
  serviceRating?: number;
  environmentRating?: number;
  medias: {
    mediaUrl: string;
    mediaType: "PHOTO" | "VIDEO";
  }[];
}) {
  const response = await api.post("/posts", data);

  return response.data;
}

/*
  Edita uma postagem existente.

  Mantemos o envio das seis notas para que a média
  seja recalculada corretamente no backend.
*/
export async function updatePost(
  postId: string,
  data: {
    title: string;
    description: string;
    recommendationRating: number;
    priceRating: number;
    flavorRating: number;
    presentationRating: number;
    serviceRating: number;
    environmentRating: number;
  },
) {
  const response = await api.patch<Post>(`/posts/${postId}`, data);
  return response.data;
}

/*
  Exclui uma postagem.
*/
export async function deletePost(postId: string) {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
}
