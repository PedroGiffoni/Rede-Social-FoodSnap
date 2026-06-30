"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const LikeService_1 = require("../services/LikeService");
/*
  LikeController

  Recebe requisições HTTP relacionadas às curtidas
  e chama o LikeService.
*/
class LikeController {
    /*
      POST /posts/:postId/like
  
      Alterna a curtida de uma postagem.
  
      Precisa de token JWT.
      O usuário vem de req.user, preenchido pelo authMiddleware.
    */
    async toggle(req, res) {
        try {
            const { postId } = req.params;
            const likeService = new LikeService_1.LikeService();
            const result = await likeService.toggleLike(req.user?.id, postId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao curtir postagem.",
            });
        }
    }
}
exports.LikeController = LikeController;
