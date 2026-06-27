import { prisma } from "../database/prisma";

/*
  RankingRepository

  Camada responsável por buscar no banco os dados necessários
  para montar os rankings do FoodSnap.

  Aqui não calculamos regra de negócio complexa.
  Apenas buscamos os restaurantes e seus posts avaliativos.
*/

export class RankingRepository {
  /*
    Busca restaurantes com posts do tipo REVIEW.

    Esse método serve para o ranking geral de restaurantes,
    considerando avaliações feitas por usuários COMMON e INFLUENCER.
  */
  async getRestaurantsWithReviews() {
    return prisma.businessProfile.findMany({
      include: {
        category: true,
        posts: {
          where: {
            postType: "REVIEW",
            averageRating: {
              not: null,
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                userType: true,
              },
            },
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  /*
    Busca restaurantes com avaliações feitas apenas por influenciadores.

    Esse método serve para:
    GET /ranking/restaurants/influencers
  */
  async getRestaurantsWithInfluencerReviews() {
    return prisma.businessProfile.findMany({
      include: {
        category: true,
        posts: {
          where: {
            postType: "REVIEW",
            averageRating: {
              not: null,
            },
            author: {
              userType: "INFLUENCER",
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                userType: true,
              },
            },
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  /*
    Busca restaurantes com avaliações feitas apenas por usuários comuns.

    Esse método é útil para comparar:
    - opinião da comunidade
    - opinião dos influenciadores
  */
  async getRestaurantsWithCommunityReviews() {
    return prisma.businessProfile.findMany({
      include: {
        category: true,
        posts: {
          where: {
            postType: "REVIEW",
            averageRating: {
              not: null,
            },
            author: {
              userType: "COMMON",
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                userType: true,
              },
            },
            likes: true,
            comments: true,
          },
        },
      },
    });
  }
}
