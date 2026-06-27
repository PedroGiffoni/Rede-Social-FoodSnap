import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  commentRoutes

  Arquivo responsável por registrar as rotas de comentários.
*/

const commentRoutes = Router();

const commentController = new CommentController();

/*
  GET /posts/:postId/comments

  Lista comentários de uma postagem.
  Não precisa estar logado.
*/
commentRoutes.get("/posts/:postId/comments", commentController.index);

/*
  POST /posts/:postId/comments

  Cria comentário.
  Precisa estar logado.
*/
commentRoutes.post(
  "/posts/:postId/comments",
  authMiddleware,
  commentController.create,
);

export { commentRoutes };
