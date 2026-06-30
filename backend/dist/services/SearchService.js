"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const SearchRepository_1 = require("../repositories/SearchRepository");
/*
  SearchService

  Camada responsável pelas regras da busca global.

  Aqui validamos o termo pesquisado e organizamos o retorno
  para a aba Buscar do frontend.
*/
class SearchService {
    constructor() {
        this.searchRepository = new SearchRepository_1.SearchRepository();
    }
    /*
      Executa a busca global.
  
      Uma única pesquisa retorna:
      - usuários
      - empreendimentos
      - postagens
      - categorias
    */
    async globalSearch(term) {
        if (!term || term.trim().length === 0) {
            throw new Error("Informe um termo para buscar.");
        }
        const cleanTerm = term.trim();
        const [users, businesses, posts, categories] = await Promise.all([
            this.searchRepository.searchUsers(cleanTerm),
            this.searchRepository.searchBusinesses(cleanTerm),
            this.searchRepository.searchPosts(cleanTerm),
            this.searchRepository.searchCategories(cleanTerm),
        ]);
        return {
            term: cleanTerm,
            users,
            businesses,
            posts,
            categories,
        };
    }
}
exports.SearchService = SearchService;
