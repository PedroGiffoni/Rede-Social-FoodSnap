"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const CategoryService_1 = require("../services/CategoryService");
/*
  CategoryController

  Responsável por receber requisições HTTP relacionadas às categorias
  e devolver respostas para o cliente.

  O Controller não deve conter regra de negócio pesada.
  Ele chama o Service, recebe o resultado e responde.
*/
class CategoryController {
    /*
      GET /categories
  
      Lista todas as categorias gastronômicas cadastradas no banco.
    */
    async index(req, res) {
        try {
            const categoryService = new CategoryService_1.CategoryService();
            const categories = await categoryService.listCategories();
            return res.status(200).json(categories);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao listar categorias.",
            });
        }
    }
}
exports.CategoryController = CategoryController;
