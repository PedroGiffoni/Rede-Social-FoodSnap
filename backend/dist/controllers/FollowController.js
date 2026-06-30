"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
const FollowService_1 = require("../services/FollowService");
/*
  FollowController

  Recebe requisições HTTP relacionadas a seguidores
  e chama o FollowService.
*/
class FollowController {
    /*
      POST /users/:userId/follow
  
      O usuário logado passa a seguir ou deixa de seguir o perfil informado.
  
      Exemplo:
      Pedro logado quer seguir João:
      POST /users/ID_DO_JOAO/follow
    */
    async toggle(req, res) {
        try {
            const { userId } = req.params;
            const followService = new FollowService_1.FollowService();
            const result = await followService.toggleFollow(req.user?.id, userId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao seguir ou deixar de seguir.",
            });
        }
    }
    /*
      GET /users/:userId/following
  
      Lista quem o usuário está seguindo.
    */
    async following(req, res) {
        try {
            const { userId } = req.params;
            const followService = new FollowService_1.FollowService();
            const following = await followService.listFollowing(userId);
            return res.status(200).json(following);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar perfis seguidos.",
            });
        }
    }
    /*
      GET /users/:userId/followers
  
      Lista quem segue o usuário.
    */
    async followers(req, res) {
        try {
            const { userId } = req.params;
            const followService = new FollowService_1.FollowService();
            const followers = await followService.listFollowers(userId);
            return res.status(200).json(followers);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao listar seguidores.",
            });
        }
    }
    /*
      GET /users/:userId/follow-stats
  
      Retorna os números de seguidores e seguindo.
    */
    async stats(req, res) {
        try {
            const { userId } = req.params;
            const followService = new FollowService_1.FollowService();
            const stats = await followService.getFollowStats(userId);
            return res.status(200).json(stats);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao buscar estatísticas de seguidores.",
            });
        }
    }
}
exports.FollowController = FollowController;
