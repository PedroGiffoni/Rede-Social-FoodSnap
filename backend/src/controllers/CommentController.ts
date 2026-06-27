import { Request, Response } from "express";
import { CommentService } from "../services/CommentService";

/*
  CommentController

  Recebe as requisições HTTP de comentários
  e chama o CommentService.
*/

export class CommentController {
  /*
    POST /posts/:postId/comments

    Cria um comentário em uma postagem.

    Precisa de token JWT.
  */
  async create(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      const commentService = new CommentService();

      const comment = await commentService.createComment({
        postId,
        userId: req.user?.id as string,
        content,
      });

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar comentário.",
      });
    }
  }

  /*
    GET /posts/:postId/comments

    Lista todos os comentários de uma postagem.

    Não precisa de login.
  */
  async index(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const commentService = new CommentService();

      const comments = await commentService.listCommentsByPost(postId);

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar comentários.",
      });
    }
  }
}
