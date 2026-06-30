"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const SearchService_1 = require("../services/SearchService");
/*
  SearchController

  Recebe a requisição HTTP da busca global
  e chama o SearchService.
*/
class SearchController {
    /*
      GET /search?term=burger
  
      Busca global da aba Buscar.
    */
    async index(req, res) {
        try {
            const term = String(req.query.term || "");
            const searchService = new SearchService_1.SearchService();
            const result = await searchService.globalSearch(term);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao realizar busca.",
            });
        }
    }
}
exports.SearchController = SearchController;
