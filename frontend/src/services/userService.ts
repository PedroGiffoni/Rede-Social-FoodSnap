import { api } from "../api/api";

/*
  userService

  Busca e atualiza dados públicos do usuário.
*/

/*
  Busca perfil público.
*/
export async function getUserById(userId: string) {
  const response = await api.get(`/users/${userId}`);

  return response.data;
}

/*
  Atualiza a foto de perfil do usuário logado.

  avatarUrl é a URL retornada pelo Cloudinary.
*/
export async function updateMyAvatar(avatarUrl: string) {
  const response = await api.patch("/users/avatar", {
    avatarUrl,
  });

  return response.data;
}

/*
  Atualiza dados do perfil.

  Permite alterar:
  - nome
  - bio
  - cidade
*/
export async function updateMyProfile(data: {
  name: string;
  bio?: string;
  city?: string;
}) {
  const response = await api.patch("/users/profile", data);

  return response.data;
}

/*
  Busca usuários por nome ou cidade.
*/
export async function searchUsers(term: string) {
  const response = await api.get(
    `/users/search?term=${encodeURIComponent(term)}`,
  );

  return response.data;
}
