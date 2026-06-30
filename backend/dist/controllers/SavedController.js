"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedController = void 0;
const SavedService_1 = require("../services/SavedService");
/*
  SavedController

  Recebe requisições HTTP relacionadas a salvos/favoritos
  e chama o SavedService.
*/
class SavedController {
    /*
      POST /saved/posts/:postId
  
      Salva ou remove uma postagem dos favoritos.
    */
    async togglePost(req, res) {
        try {
            const { postId } = req.params;
            const savedService = new SavedService_1.SavedService();
            const result = await savedService.toggleSavedPost(req.user?.id, postId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao salvar postagem.",
            });
        }
    }
    /*
      GET /saved/posts
  
      Lista postagens salvas do usuário logado.
    */
    async listPosts(req, res) {
        try {
            const savedService = new SavedService_1.SavedService();
            const posts = await savedService.listSavedPosts(req.user?.id);
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar postagens salvas.",
            });
        }
    }
    /*
      POST /saved/businesses/:businessProfileId
  
      Salva ou remove um restaurante dos favoritos.
    */
    async toggleBusiness(req, res) {
        try {
            const { businessProfileId } = req.params;
            const savedService = new SavedService_1.SavedService();
            const result = await savedService.toggleSavedBusiness(req.user?.id, businessProfileId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao salvar restaurante.",
            });
        }
    }
    /*
      GET /saved/businesses
  
      Lista restaurantes salvos do usuário logado.
    */
    async listBusinesses(req, res) {
        try {
            const savedService = new SavedService_1.SavedService();
            const businesses = await savedService.listSavedBusinesses(req.user?.id);
            return res.status(200).json(businesses);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar restaurantes salvos.",
            });
        }
    }
}
exports.SavedController = SavedController;
