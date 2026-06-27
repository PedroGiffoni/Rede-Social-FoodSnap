import { SearchRepository } from "../repositories/SearchRepository";

/*
  SearchService

  Camada responsável pelas regras da busca global.

  Aqui validamos o termo pesquisado e organizamos o retorno
  para a aba Buscar do frontend.
*/

export class SearchService {
  private searchRepository: SearchRepository;

  constructor() {
    this.searchRepository = new SearchRepository();
  }

  /*
    Executa a busca global.

    Uma única pesquisa retorna:
    - usuários
    - empreendimentos
    - postagens
    - categorias
  */
  async globalSearch(term: string) {
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
