import { Request, Response } from "express";
import { LikeService } from "../services/LikeService";

/*
  LikeController

  Recebe requisições HTTP relacionadas às curtidas
  e chama o LikeService.
*/

export class LikeController {
  /*
    POST /posts/:postId/like

    Alterna a curtida de uma postagem.

    Precisa de token JWT.
    O usuário vem de req.user, preenchido pelo authMiddleware.
  */
  async toggle(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const likeService = new LikeService();

      const result = await likeService.toggleLike(
        req.user?.id as string,
        postId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao curtir postagem.",
      });
    }
  }
}
