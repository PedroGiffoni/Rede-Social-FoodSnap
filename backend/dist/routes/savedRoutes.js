"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedRoutes = void 0;
const express_1 = require("express");
const SavedController_1 = require("../controllers/SavedController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  savedRoutes

  Rotas de postagens e restaurantes salvos.
*/
const savedRoutes = (0, express_1.Router)();
exports.savedRoutes = savedRoutes;
const savedController = new SavedController_1.SavedController();
/*
  Todas as rotas de salvos precisam de login.
*/
savedRoutes.use(authMiddleware_1.authMiddleware);
/*
  POST /saved/posts/:postId

  Salva ou remove uma postagem.
*/
savedRoutes.post("/posts/:postId", savedController.togglePost);
/*
  GET /saved/posts

  Lista postagens salvas.
*/
savedRoutes.get("/posts", savedController.listPosts);
/*
  POST /saved/businesses/:businessProfileId

  Salva ou remove restaurante.
*/
savedRoutes.post("/businesses/:businessProfileId", savedController.toggleBusiness);
/*
  GET /saved/businesses

  Lista restaurantes salvos.
*/
savedRoutes.get("/businesses", savedController.listBusinesses);
