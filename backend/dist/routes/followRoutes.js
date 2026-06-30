"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRoutes = void 0;
const express_1 = require("express");
const FollowController_1 = require("../controllers/FollowController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  followRoutes

  Rotas do sistema de seguidores.
*/
const followRoutes = (0, express_1.Router)();
exports.followRoutes = followRoutes;
const followController = new FollowController_1.FollowController();
/*
  POST /users/:userId/follow

  Seguir ou deixar de seguir um usuário.
  Precisa estar logado.
*/
followRoutes.post("/users/:userId/follow", authMiddleware_1.authMiddleware, followController.toggle);
/*
  GET /users/:userId/following

  Lista quem um usuário segue.
*/
followRoutes.get("/users/:userId/following", followController.following);
/*
  GET /users/:userId/followers

  Lista seguidores de um usuário.
*/
followRoutes.get("/users/:userId/followers", followController.followers);
/*
  GET /users/:userId/follow-stats

  Retorna contagem de seguidores e seguindo.
*/
followRoutes.get("/users/:userId/follow-stats", followController.stats);
