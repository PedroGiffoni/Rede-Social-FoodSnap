"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const PostController_1 = require("../controllers/PostController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  postRoutes

  Rotas de postagens.

  Ordem importante:
  Rotas específicas como /explore e /search precisam vir antes de /:id.
*/
const postRoutes = (0, express_1.Router)();
exports.postRoutes = postRoutes;
const postController = new PostController_1.PostController();
/*
  GET /posts

  Feed principal.
*/
postRoutes.get("/", postController.index);
/*
  GET /posts/explore

  Aba Buscar/Explorar.
  Retorna posts variados para preencher a tela inicial da busca.
*/
postRoutes.get("/explore", postController.explore);
/*
  GET /posts/search

  Busca com filtros.
*/
postRoutes.get("/search", postController.search);
/*
  GET /posts/business/:businessProfileId

  Posts de um restaurante.
*/
postRoutes.get("/business/:businessProfileId", postController.listByBusiness);
/*
  GET /posts/following/feed

  Feed personalizado.
  Precisa estar logado.
*/
postRoutes.get("/following/feed", authMiddleware_1.authMiddleware, postController.followingFeed);
/*
  GET /posts/:id

  Detalhes de um post.
*/
/*
  GET /posts/user/:userId

  Lista postagens de um usuário específico.
*/
postRoutes.get("/user/:userId", postController.listByUser);
postRoutes.get("/:id", postController.show);
/*
  PATCH /posts/:id

  Edita uma postagem.
*/
postRoutes.patch("/:id", authMiddleware_1.authMiddleware, postController.update);
/*
  POST /posts

  Cria postagem.
  Precisa estar logado.
*/
/*
  DELETE /posts/:id

  Remove uma postagem.
*/
postRoutes.delete("/:id", authMiddleware_1.authMiddleware, postController.delete);
postRoutes.post("/", authMiddleware_1.authMiddleware, postController.create);
