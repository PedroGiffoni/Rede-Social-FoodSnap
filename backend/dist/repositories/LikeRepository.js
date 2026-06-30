"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRepository = void 0;
const prisma_1 = require("../database/prisma");
/*
  LikeRepository

  Camada responsável por acessar diretamente a tabela de curtidas.

  Regras de negócio não ficam aqui.
  Aqui apenas buscamos, criamos, removemos e contamos curtidas.
*/
class LikeRepository {
    /*
      Verifica se um usuário já curtiu determinado post.
  
      Isso é importante porque o mesmo usuário não pode curtir
      o mesmo post mais de uma vez.
    */
    async findByUserAndPost(userId, postId) {
        return prisma_1.prisma.like.findUnique({
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
    async create(userId, postId) {
        return prisma_1.prisma.like.create({
            data: {
                userId,
                postId,
            },
        });
    }
    /*
      Remove uma curtida existente.
    */
    async delete(likeId) {
        return prisma_1.prisma.like.delete({
            where: {
                id: likeId,
            },
        });
    }
    /*
      Conta quantas curtidas uma postagem possui.
    */
    async countByPost(postId) {
        return prisma_1.prisma.like.count({
            where: {
                postId,
            },
        });
    }
}
exports.LikeRepository = LikeRepository;
