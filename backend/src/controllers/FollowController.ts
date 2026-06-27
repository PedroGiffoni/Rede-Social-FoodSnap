import { Request, Response } from "express";
import { FollowService } from "../services/FollowService";

/*
  FollowController

  Recebe requisições HTTP relacionadas a seguidores
  e chama o FollowService.
*/

export class FollowController {
  /*
    POST /users/:userId/follow

    O usuário logado passa a seguir ou deixa de seguir o perfil informado.

    Exemplo:
    Pedro logado quer seguir João:
    POST /users/ID_DO_JOAO/follow
  */
  async toggle(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const followService = new FollowService();

      const result = await followService.toggleFollow(
        req.user?.id as string,
        userId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao seguir ou deixar de seguir.",
      });
    }
  }

  /*
    GET /users/:userId/following

    Lista quem o usuário está seguindo.
  */
  async following(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const followService = new FollowService();

      const following = await followService.listFollowing(userId);

      return res.status(200).json(following);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar perfis seguidos.",
      });
    }
  }

  /*
    GET /users/:userId/followers

    Lista quem segue o usuário.
  */
  async followers(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const followService = new FollowService();

      const followers = await followService.listFollowers(userId);

      return res.status(200).json(followers);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao listar seguidores.",
      });
    }
  }

  /*
    GET /users/:userId/follow-stats

    Retorna os números de seguidores e seguindo.
  */
  async stats(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const followService = new FollowService();

      const stats = await followService.getFollowStats(userId);

      return res.status(200).json(stats);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao buscar estatísticas de seguidores.",
      });
    }
  }
}
