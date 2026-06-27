import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";

/*
  CategoryController

  Responsável por receber requisições HTTP relacionadas às categorias
  e devolver respostas para o cliente.

  O Controller não deve conter regra de negócio pesada.
  Ele chama o Service, recebe o resultado e responde.
*/

export class CategoryController {
  /*
    GET /categories

    Lista todas as categorias gastronômicas cadastradas no banco.
  */
  async index(req: Request, res: Response) {
    try {
      const categoryService = new CategoryService();

      const categories = await categoryService.listCategories();

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar categorias.",
      });
    }
  }
}
