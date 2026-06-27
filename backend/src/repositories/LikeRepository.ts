import { prisma } from "../database/prisma";

/*
  LikeRepository

  Camada responsável por acessar diretamente a tabela de curtidas.

  Regras de negócio não ficam aqui.
  Aqui apenas buscamos, criamos, removemos e contamos curtidas.
*/

export class LikeRepository {
  /*
    Verifica se um usuário já curtiu determinado post.

    Isso é importante porque o mesmo usuário não pode curtir
    o mesmo post mais de uma vez.
  */
  async findByUserAndPost(userId: string, postId: string) {
    return prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  /*
    Cria uma curtida.
  */
  async create(userId: string, postId: string) {
    return prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  /*
    Remove uma curtida existente.
  */
  async delete(likeId: string) {
    return prisma.like.delete({
      where: {
        id: likeId,
      },
    });
  }

  /*
    Conta quantas curtidas uma postagem possui.
  */
  async countByPost(postId: string) {
    return prisma.like.count({
      where: {
        postId,
      },
    });
  }
}
