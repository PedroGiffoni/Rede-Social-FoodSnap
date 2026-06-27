import { Request, Response } from "express";
import { SearchService } from "../services/SearchService";

/*
  SearchController

  Recebe a requisição HTTP da busca global
  e chama o SearchService.
*/

export class SearchController {
  /*
    GET /search?term=burger

    Busca global da aba Buscar.
  */
  async index(req: Request, res: Response) {
    try {
      const term = String(req.query.term || "");

      const searchService = new SearchService();

      const result = await searchService.globalSearch(term);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao realizar busca.",
      });
    }
  }
}
