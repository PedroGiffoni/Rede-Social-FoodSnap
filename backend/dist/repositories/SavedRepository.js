"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedRepository = void 0;
const prisma_1 = require("../database/prisma");
/*
  SavedRepository

  Camada responsável por acessar diretamente as tabelas:
  - saved_posts
  - saved_businesses

  Essas tabelas guardam:
  - postagens salvas pelo usuário
  - restaurantes salvos pelo usuário
*/
class SavedRepository {
    /*
      Verifica se um post já está salvo pelo usuário.
    */
    async findSavedPost(userId, postId) {
        return prisma_1.prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    }
    /*
      Salva um post.
    */
    async savePost(userId, postId) {
        return prisma_1.prisma.savedPost.create({
            data: {
                userId,
                postId,
            },
        });
    }
    /*
      Remove um post salvo.
    */
    async unsavePost(savedPostId) {
        return prisma_1.prisma.savedPost.delete({
            where: {
                id: savedPostId,
            },
        });
    }
    /*
      Lista posts salvos por um usuário.
    */
    async listSavedPosts(userId) {
        return prisma_1.prisma.savedPost.findMany({
            where: {
                userId,
            },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                                userType: true,
                                city: true,
                            },
                        },
                        businessProfile: true,
                        category: true,
                        medias: true,
                        comments: true,
                        likes: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /*
      Verifica se um restaurante já está salvo pelo usuário.
    */
    async findSavedBusiness(userId, businessProfileId) {
        return prisma_1.prisma.savedBusiness.findUnique({
            where: {
                userId_businessProfileId: {
                    userId,
                    businessProfileId,
                },
            },
        });
    }
    /*
      Salva um restaurante.
    */
    async saveBusiness(userId, businessProfileId) {
        return prisma_1.prisma.savedBusiness.create({
            data: {
                userId,
                businessProfileId,
            },
        });
    }
    /*
      Remove um restaurante salvo.
    */
    async unsaveBusiness(savedBusinessId) {
        return prisma_1.prisma.savedBusiness.delete({
            where: {
                id: savedBusinessId,
            },
        });
    }
    /*
      Lista restaurantes salvos por um usuário.
    */
    async listSavedBusinesses(userId) {
        return prisma_1.prisma.savedBusiness.findMany({
            where: {
                userId,
            },
            include: {
                businessProfile: {
                    include: {
                        category: true,
                        coupons: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.SavedRepository = SavedRepository;
