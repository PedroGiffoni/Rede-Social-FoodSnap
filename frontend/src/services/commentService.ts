import { api } from "../api/api";

/*
  commentService

  Responsável por criar comentários em postagens.
*/

export async function createComment(postId: string, content: string) {
  const response = await api.post(`/posts/${postId}/comments`, {
    content,
  });

  return response.data;
}
