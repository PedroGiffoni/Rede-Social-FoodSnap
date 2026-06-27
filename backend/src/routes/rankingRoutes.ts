import { Router } from "express";
import { RankingController } from "../controllers/RankingController";

/*
  rankingRoutes

  Rotas públicas de ranking do FoodSnap.

  Aqui NÃO teremos ranking de influenciadores.

  Teremos:
  - ranking geral de restaurantes
  - ranking de restaurantes segundo influenciadores
  - ranking de restaurantes segundo usuários comuns
*/

const rankingRoutes = Router();

const rankingController = new RankingController();

/*
  GET /ranking/restaurants

  Ranking geral.
*/
rankingRoutes.get("/restaurants", rankingController.restaurants);

/*
  GET /ranking/restaurants/influencers

  Ranking filtrado por avaliações feitas por influenciadores.
*/
rankingRoutes.get(
  "/restaurants/influencers",
  rankingController.restaurantsByInfluencers,
);

/*
  GET /ranking/restaurants/community

  Ranking filtrado por avaliações feitas por usuários comuns.
*/
rankingRoutes.get(
  "/restaurants/community",
  rankingController.restaurantsByCommunity,
);

export { rankingRoutes };
