import { api } from "../api/api";

/*
  followService

  Responsável por buscar dados de seguidores e seguindo.
*/

export async function getFollowStats(userId: string) {
  const response = await api.get(`/users/${userId}/follow-stats`);

  return response.data;
}

export async function getFollowers(userId: string) {
  const response = await api.get(`/users/${userId}/followers`);

  return response.data;
}

export async function getFollowing(userId: string) {
  const response = await api.get(`/users/${userId}/following`);

  return response.data;
}
