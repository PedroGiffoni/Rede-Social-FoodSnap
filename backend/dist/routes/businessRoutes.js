"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRoutes = void 0;
const express_1 = require("express");
const BusinessController_1 = require("../controllers/BusinessController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  businessRoutes

  Rotas dos empreendimentos.
*/
const businessRoutes = (0, express_1.Router)();
exports.businessRoutes = businessRoutes;
const businessController = new BusinessController_1.BusinessController();
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
businessRoutes.get("/me", authMiddleware_1.authMiddleware, businessController.me);
/*
  PATCH /businesses/me

  Atualiza dados do restaurante.
*/
businessRoutes.patch("/me", authMiddleware_1.authMiddleware, businessController.update);
/*
  GET /businesses/:id

  Detalhes de um empreendimento.
*/
/*
  PATCH /businesses/me/images

  Atualiza foto e capa do restaurante.
*/
businessRoutes.patch("/me/images", authMiddleware_1.authMiddleware, businessController.updateImages);
businessRoutes.get("/ranking", businessController.ranking);
/*
  GET /businesses/following/me

  Lista restaurantes seguidos pelo usuário logado.
*/
businessRoutes.get("/following/me", authMiddleware_1.authMiddleware, businessController.myFollowedBusinesses);
/*
  PATCH /businesses/:id/follow

  Segue ou deixa de seguir restaurante.
*/
businessRoutes.patch("/:id/follow", authMiddleware_1.authMiddleware, businessController.toggleFollow);
/*
  GET /businesses/:id/followers-count

  Conta seguidores do restaurante.
*/
businessRoutes.get("/:id/followers-count", businessController.followersCount);
businessRoutes.get("/:id/followers", businessController.businessFollowers);
/*
  GET /businesses/:id/follow-status

  Verifica se o usuário logado já segue o restaurante.
*/
businessRoutes.get("/:id/follow-status", authMiddleware_1.authMiddleware, businessController.followStatus);
businessRoutes.get("/:id", businessController.show);
/*
  POST /businesses

  Cria empreendimento.
  Precisa estar logado.
*/
businessRoutes.post("/", authMiddleware_1.authMiddleware, businessController.create);
