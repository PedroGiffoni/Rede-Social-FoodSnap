import { prisma } from "../database/prisma";

/*
  FollowRepository

  Camada responsável por acessar diretamente a tabela follows.

  A tabela follows representa quem segue quem.

  Exemplo:
  Pedro segue João

  followerId  = Pedro
  followingId = João
*/

export class FollowRepository {
  /*
    Verifica se um usuário já segue outro.

    Isso evita seguir a mesma pessoa duas vezes.
  */
  async findByFollowerAndFollowing(followerId: string, followingId: string) {
    return prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  /*
    Cria um novo vínculo de seguir.
  */
  async create(followerId: string, followingId: string) {
    return prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  /*
    Remove um vínculo de seguir.

    Usado quando o usuário deixa de seguir alguém.
  */
  async delete(followId: string) {
    return prisma.follow.delete({
      where: {
        id: followId,
      },
    });
  }

  /*
    Conta quantas pessoas um usuário segue.
  */
  async countFollowing(userId: string) {
    return prisma.follow.count({
      where: {
        followerId: userId,
      },
    });
  }

  /*
    Conta quantos seguidores um usuário possui.
  */
  async countFollowers(userId: string) {
    return prisma.follow.count({
      where: {
        followingId: userId,
      },
    });
  }

  /*
    Lista quem o usuário está seguindo.

    Exemplo:
    Pedro está seguindo João, Maria e Seu Burger.
  */
  async listFollowing(userId: string) {
    return prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            city: true,
            userType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
    Lista quem segue o usuário.

    Exemplo:
    João, Maria e Seu Burger seguem Pedro.
  */
  async listFollowers(userId: string) {
    return prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            city: true,
            userType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
