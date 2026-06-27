import { api } from "../api/api";
import type { BusinessProfile, Coupon } from "../types/Business";
import type { Post } from "../types/Post";

/*
  businessService

  Responsável por buscar dados de restaurantes no backend.
*/

export async function getBusinessById(businessId: string) {
  const response = await api.get<BusinessProfile>(`/businesses/${businessId}`);

  return response.data;
}

export async function getBusinessPosts(businessId: string) {
  const response = await api.get<Post[]>(`/posts/business/${businessId}`);

  return response.data;
}

export async function getBusinessCoupons(businessId: string) {
  const response = await api.get<Coupon[]>(`/coupons/business/${businessId}`);

  return response.data;
}

/*
  Busca o restaurante vinculado ao usuário logado.
*/
export async function getMyBusiness() {
  const response = await api.get<BusinessProfile>("/businesses/me");

  return response.data;
}

/*
  Atualiza avatar e capa do restaurante.
*/
export async function updateBusinessImages(data: {
  avatarUrl?: string;
  coverUrl?: string;
}) {
  const response = await api.patch("/businesses/me/images", data);

  return response.data;
}

/*
  Atualiza os dados do restaurante logado.
*/
export async function updateMyBusiness(data: {
  businessName?: string;
  description?: string;
  address?: string;
  city?: string;
  website?: string;
  openingHours?: string;
}) {
  const response = await api.patch("/businesses/me", data);

  return response.data;
}

/*
  Busca restaurantes por nome.
*/
export async function searchBusinesses(term: string) {
  const response = await api.get(
    `/businesses/search?term=${encodeURIComponent(term)}`,
  );

  return response.data;
}

/*
  Lista todos os restaurantes.
*/
export async function getAllBusinesses() {
  const response = await api.get("/businesses");

  return response.data;
}

/*
  Busca ranking real dos restaurantes.
*/
export async function getBusinessRanking() {
  const response = await api.get("/businesses/ranking");

  return response.data;
}

/*
  Segue ou deixa de seguir um restaurante.
*/
export async function toggleFollowBusiness(businessId: string) {
  const response = await api.patch(`/businesses/${businessId}/follow`);

  return response.data;
}

/*
  Busca quantidade de seguidores de um restaurante.
*/
export async function getBusinessFollowersCount(businessId: string) {
  const response = await api.get(`/businesses/${businessId}/followers-count`);

  return response.data;
}

/*
  Lista restaurantes seguidos pelo usuário logado.
*/
export async function getMyFollowedBusinesses() {
  const response = await api.get("/businesses/following/me");

  return response.data;
}

/*
  Lista seguidores de um restaurante.
*/
export async function getBusinessFollowers(businessId: string) {
  const response = await api.get(`/businesses/${businessId}/followers`);

  return response.data;
}
