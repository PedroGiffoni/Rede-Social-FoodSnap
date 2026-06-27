import { Router } from "express";
import { FollowController } from "../controllers/FollowController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  followRoutes

  Rotas do sistema de seguidores.
*/

const followRoutes = Router();

const followController = new FollowController();

/*
  POST /users/:userId/follow

  Seguir ou deixar de seguir um usuário.
  Precisa estar logado.
*/
followRoutes.post(
  "/users/:userId/follow",
  authMiddleware,
  followController.toggle,
);

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

export { followRoutes };
