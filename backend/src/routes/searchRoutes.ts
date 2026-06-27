import { Router } from "express";
import { SearchController } from "../controllers/SearchController";

/*
  searchRoutes

  Rotas da busca global.
*/

const searchRoutes = Router();

const searchController = new SearchController();

/*
  GET /search?term=burger
*/
searchRoutes.get("/", searchController.index);

export { searchRoutes };
