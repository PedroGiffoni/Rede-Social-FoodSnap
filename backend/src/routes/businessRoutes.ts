import { Router } from "express";
import { BusinessController } from "../controllers/BusinessController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  businessRoutes

  Rotas dos empreendimentos.
*/

const businessRoutes = Router();

const businessController = new BusinessController();

/*
  GET /businesses

  Lista empreendimentos.
*/
businessRoutes.get("/", businessController.index);

/*
  GET /businesses/search?name=burger
  GET /businesses/search?term=burger

  Busca empreendimentos.

  IMPORTANTE:
  Esta rota precisa vir antes de "/:id".
*/
businessRoutes.get("/search", businessController.search);

/*
  GET /businesses/me

  Retorna o restaurante do usuário logado.
*/
businessRoutes.get("/me", authMiddleware, businessController.me);

/*
  PATCH /businesses/me

  Atualiza dados do restaurante.
*/
businessRoutes.patch("/me", authMiddleware, businessController.update);

/*
  GET /businesses/:id

  Detalhes de um empreendimento.
*/

/*
  PATCH /businesses/me/images

  Atualiza foto e capa do restaurante.
*/
businessRoutes.patch(
  "/me/images",
  authMiddleware,
  businessController.updateImages,
);
businessRoutes.get("/ranking", businessController.ranking);
/*
  GET /businesses/following/me

  Lista restaurantes seguidos pelo usuário logado.
*/
businessRoutes.get(
  "/following/me",
  authMiddleware,
  businessController.myFollowedBusinesses,
);

/*
  PATCH /businesses/:id/follow

  Segue ou deixa de seguir restaurante.
*/
businessRoutes.patch(
  "/:id/follow",
  authMiddleware,
  businessController.toggleFollow,
);

/*
  GET /businesses/:id/followers-count

  Conta seguidores do restaurante.
*/
businessRoutes.get("/:id/followers-count", businessController.followersCount);
businessRoutes.get("/:id/followers", businessController.businessFollowers);
businessRoutes.get("/:id", businessController.show);

/*
  POST /businesses

  Cria empreendimento.
  Precisa estar logado.
*/
businessRoutes.post("/", authMiddleware, businessController.create);

export { businessRoutes };
