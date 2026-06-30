"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const express_1 = require("express");
const SearchController_1 = require("../controllers/SearchController");
/*
  searchRoutes

  Rotas da busca global.
*/
const searchRoutes = (0, express_1.Router)();
exports.searchRoutes = searchRoutes;
const searchController = new SearchController_1.SearchController();
/*
  GET /search?term=burger
*/
searchRoutes.get("/", searchController.index);
