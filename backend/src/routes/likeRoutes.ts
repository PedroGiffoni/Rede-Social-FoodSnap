import { Router } from "express";
import { LikeController } from "../controllers/LikeController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  likeRoutes

  Arquivo responsável pelas rotas de curtidas.
*/

const likeRoutes = Router();

const likeController = new LikeController();

/*
  POST /posts/:postId/like

  Essa rota precisa estar protegida.
  Somente usuários logados podem curtir.
*/
likeRoutes.post("/posts/:postId/like", authMiddleware, likeController.toggle);

export { likeRoutes };
