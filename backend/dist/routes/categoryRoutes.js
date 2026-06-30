"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const CategoryController_1 = require("../controllers/CategoryController");
/*
  categoryRoutes

  Arquivo responsável por registrar as rotas de categorias.
*/
const categoryRoutes = (0, express_1.Router)();
exports.categoryRoutes = categoryRoutes;
const categoryController = new CategoryController_1.CategoryController();
/*
  GET /categories

  Retorna a lista de categorias gastronômicas.
*/
categoryRoutes.get("/", categoryController.index);
