import { Request, Response } from "express";
import { SavedService } from "../services/SavedService";

/*
  SavedController

  Recebe requisições HTTP relacionadas a salvos/favoritos
  e chama o SavedService.
*/

export class SavedController {
  /*
    POST /saved/posts/:postId

    Salva ou remove uma postagem dos favoritos.
  */
  async togglePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const savedService = new SavedService();

      const result = await savedService.toggleSavedPost(
        req.user?.id as string,
        postId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao salvar postagem.",
      });
    }
  }

  /*
    GET /saved/posts

    Lista postagens salvas do usuário logado.
  */
  async listPosts(req: Request, res: Response) {
    try {
      const savedService = new SavedService();

      const posts = await savedService.listSavedPosts(req.user?.id as string);

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar postagens salvas.",
      });
    }
  }

  /*
    POST /saved/businesses/:businessProfileId

    Salva ou remove um restaurante dos favoritos.
  */
  async toggleBusiness(req: Request, res: Response) {
    try {
      const { businessProfileId } = req.params;

      const savedService = new SavedService();

      const result = await savedService.toggleSavedBusiness(
        req.user?.id as string,
        businessProfileId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao salvar restaurante.",
      });
    }
  }

  /*
    GET /saved/businesses

    Lista restaurantes salvos do usuário logado.
  */
  async listBusinesses(req: Request, res: Response) {
    try {
      const savedService = new SavedService();

      const businesses = await savedService.listSavedBusinesses(
        req.user?.id as string,
      );

      return res.status(200).json(businesses);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar restaurantes salvos.",
      });
    }
  }
}
