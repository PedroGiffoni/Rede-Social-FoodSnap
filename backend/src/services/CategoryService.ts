import { CategoryRepository } from "../repositories/CategoryRepository";

/*
  CategoryService

  Responsável pelas regras de negócio relacionadas às categorias.

  Neste momento, a regra é simples:
  apenas listar categorias já cadastradas pelo seed.
*/

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /*
    Retorna todas as categorias disponíveis.

    Futuramente, se quisermos esconder categorias desativadas
    ou criar ordenações especiais, essa lógica ficará aqui.
  */
  async listCategories() {
    return this.categoryRepository.findAll();
  }
}
