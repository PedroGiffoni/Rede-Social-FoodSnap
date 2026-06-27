import { api } from "../api/api";

/*
  likeService

  Responsável por curtir ou descurtir postagens.
*/

export async function toggleLike(postId: string) {
  const response = await api.post(`/posts/${postId}/like`);

  return response.data as {
    likedByCurrentUser: boolean;
    likesCount: number;
  };
}
