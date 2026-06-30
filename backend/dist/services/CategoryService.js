"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const CategoryRepository_1 = require("../repositories/CategoryRepository");
/*
  CategoryService

  Responsável pelas regras de negócio relacionadas às categorias.

  Neste momento, a regra é simples:
  apenas listar categorias já cadastradas pelo seed.
*/
class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository_1.CategoryRepository();
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
exports.CategoryService = CategoryService;
