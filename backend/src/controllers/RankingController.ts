import { Request, Response } from "express";
import { RankingService } from "../services/RankingService";

/*
  RankingController

  Recebe requisições HTTP relacionadas aos rankings
  e chama o RankingService.
*/

export class RankingController {
  /*
    GET /ranking/restaurants

    Ranking geral dos restaurantes.
  */
  async restaurants(req: Request, res: Response) {
    try {
      const rankingService = new RankingService();

      const ranking = await rankingService.getTopRestaurants();

      return res.status(200).json(ranking);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao carregar ranking geral de restaurantes.",
      });
    }
  }

  /*
    GET /ranking/restaurants/influencers

    Ranking de restaurantes baseado apenas nas avaliações
    feitas por influenciadores.
  */
  async restaurantsByInfluencers(req: Request, res: Response) {
    try {
      const rankingService = new RankingService();

      const ranking = await rankingService.getTopRestaurantsByInfluencers();

      return res.status(200).json(ranking);
    } catch (error) {
      return res.status(500).json({
        message:
          "Erro ao carregar ranking de restaurantes por influenciadores.",
      });
    }
  }

  /*
    GET /ranking/restaurants/community

    Ranking de restaurantes baseado apenas nas avaliações
    feitas por usuários comuns.
  */
  async restaurantsByCommunity(req: Request, res: Response) {
    try {
      const rankingService = new RankingService();

      const ranking = await rankingService.getTopRestaurantsByCommunity();

      return res.status(200).json(ranking);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao carregar ranking de restaurantes pela comunidade.",
      });
    }
  }
}
