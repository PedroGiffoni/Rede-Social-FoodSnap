import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

/*
  categoryRoutes

  Arquivo responsável por registrar as rotas de categorias.
*/

const categoryRoutes = Router();

const categoryController = new CategoryController();

/*
  GET /categories

  Retorna a lista de categorias gastronômicas.
*/
categoryRoutes.get("/", categoryController.index);

export { categoryRoutes };
