import { RankingRepository } from "../repositories/RankingRepository";

/*
  RankingService

  Camada responsável por calcular os rankings.

  Aqui pegamos os dados brutos do banco e transformamos em:
  - média de avaliações
  - quantidade de reviews
  - quantidade de curtidas
  - quantidade de comentários
  - posição no ranking
*/

export class RankingService {
  private rankingRepository: RankingRepository;

  constructor() {
    this.rankingRepository = new RankingRepository();
  }

  /*
    Monta o ranking a partir de uma lista de restaurantes.

    Esse método é reaproveitado para:
    - ranking geral
    - ranking por influenciadores
    - ranking por comunidade
  */
  private buildRestaurantRanking(restaurants: any[]) {
    const ranking = restaurants.map((restaurant) => {
      const reviews = restaurant.posts;

      const reviewsCount = reviews.length;

      const totalRating = reviews.reduce((sum: number, post: any) => {
        return sum + Number(post.averageRating);
      }, 0);

      const averageRating =
        reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : 0;

      const likesCount = reviews.reduce((sum: number, post: any) => {
        return sum + post.likes.length;
      }, 0);

      const commentsCount = reviews.reduce((sum: number, post: any) => {
        return sum + post.comments.length;
      }, 0);

      return {
        id: restaurant.id,
        businessName: restaurant.businessName,
        description: restaurant.description,
        city: restaurant.city,
        address: restaurant.address,
        instagram: restaurant.instagram,
        isClaimed: restaurant.isClaimed,
        category: restaurant.category,

        /*
          Dados calculados para exibir no ranking.
        */
        averageRating,
        reviewsCount,
        likesCount,
        commentsCount,

        /*
          Pequeno resumo das avaliações consideradas no ranking.
          Isso pode ser usado no frontend para mostrar:
          "Baseado em 3 avaliações"
        */
        reviews: reviews.map((post: any) => ({
          postId: post.id,
          title: post.title,
          averageRating: Number(post.averageRating),
          author: post.author,
          likesCount: post.likes.length,
          commentsCount: post.comments.length,
        })),
      };
    });

    /*
      Remove restaurantes sem avaliações válidas.
    */
    const onlyWithReviews = ranking.filter(
      (restaurant) => restaurant.reviewsCount > 0,
    );

    /*
      Ordenação:
      1. Maior média
      2. Maior número de avaliações
      3. Maior número de curtidas
    */
    const sorted = onlyWithReviews.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }

      if (b.reviewsCount !== a.reviewsCount) {
        return b.reviewsCount - a.reviewsCount;
      }

      return b.likesCount - a.likesCount;
    });

    /*
      Adiciona a posição no ranking.
    */
    return sorted.map((restaurant, index) => ({
      position: index + 1,
      ...restaurant,
    }));
  }

  /*
    Ranking geral de restaurantes.

    Considera avaliações de:
    - usuários comuns
    - influenciadores
  */
  async getTopRestaurants() {
    const restaurants =
      await this.rankingRepository.getRestaurantsWithReviews();

    return this.buildRestaurantRanking(restaurants);
  }

  /*
    Ranking de restaurantes segundo influenciadores.

    Considera apenas reviews feitas por usuários INFLUENCER.
  */
  async getTopRestaurantsByInfluencers() {
    const restaurants =
      await this.rankingRepository.getRestaurantsWithInfluencerReviews();

    return this.buildRestaurantRanking(restaurants);
  }

  /*
    Ranking de restaurantes segundo usuários comuns.

    Considera apenas reviews feitas por usuários COMMON.
  */
  async getTopRestaurantsByCommunity() {
    const restaurants =
      await this.rankingRepository.getRestaurantsWithCommunityReviews();

    return this.buildRestaurantRanking(restaurants);
  }
}
