import { prisma } from "../database/prisma";
import { UserType } from "../entities/User";

/*
  Dados necessários para criar um usuário.
*/
interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  city?: string;
  userType?: UserType;
}

/*
  Dados utilizados para atualizar o perfil do usuário.
*/
interface UpdateProfileData {
  name: string;
  bio?: string;
  city?: string;
}

/*
  UserRepository

  Responsável por conversar diretamente com a tabela users no banco.
*/
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /*
    Busca usuários para a aba Buscar.

    Procura usuários pelo nome ou pela cidade.
  */
  async search(term: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        city: true,
        avatarUrl: true,
        userType: true,
        bio: true,
      },
      take: 20,
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        city: data.city,
        userType: data.userType || "COMMON",
      },
    });
  }

  /*
    Atualiza a foto do usuário.
  */
  async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
    });
  }

  /*
    Atualiza nome, bio e cidade do usuário.
  */
  async updateProfile(userId: string, data: UpdateProfileData) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        bio: data.bio,
        city: data.city,
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        bio: true,
        avatarUrl: true,
        userType: true,
      },
    });
  }
}
