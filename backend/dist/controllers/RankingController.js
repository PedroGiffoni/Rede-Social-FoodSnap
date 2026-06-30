"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const RankingService_1 = require("../services/RankingService");
/*
  RankingController

  Recebe requisições HTTP relacionadas aos rankings
  e chama o RankingService.
*/
class RankingController {
    /*
      GET /ranking/restaurants
  
      Ranking geral dos restaurantes.
    */
    async restaurants(req, res) {
        try {
            const rankingService = new RankingService_1.RankingService();
            const ranking = await rankingService.getTopRestaurants();
            return res.status(200).json(ranking);
        }
        catch (error) {
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
    async restaurantsByInfluencers(req, res) {
        try {
            const rankingService = new RankingService_1.RankingService();
            const ranking = await rankingService.getTopRestaurantsByInfluencers();
            return res.status(200).json(ranking);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao carregar ranking de restaurantes por influenciadores.",
            });
        }
    }
    /*
      GET /ranking/restaurants/community
  
      Ranking de restaurantes baseado apenas nas avaliações
      feitas por usuários comuns.
    */
    async restaurantsByCommunity(req, res) {
        try {
            const rankingService = new RankingService_1.RankingService();
            const ranking = await rankingService.getTopRestaurantsByCommunity();
            return res.status(200).json(ranking);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao carregar ranking de restaurantes pela comunidade.",
            });
        }
    }
}
exports.RankingController = RankingController;
