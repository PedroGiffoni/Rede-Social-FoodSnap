"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = require("express");
const CommentController_1 = require("../controllers/CommentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  commentRoutes

  Arquivo responsável por registrar as rotas de comentários.
*/
const commentRoutes = (0, express_1.Router)();
exports.commentRoutes = commentRoutes;
const commentController = new CommentController_1.CommentController();
/*
  GET /posts/:postId/comments

  Lista comentários de uma postagem.
  Não precisa estar logado.
*/
commentRoutes.get("/posts/:postId/comments", commentController.index);
/*
  POST /posts/:postId/comments

  Cria comentário.
  Precisa estar logado.
*/
commentRoutes.post("/posts/:postId/comments", authMiddleware_1.authMiddleware, commentController.create);
