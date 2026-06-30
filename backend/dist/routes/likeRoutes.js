"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRoutes = void 0;
const express_1 = require("express");
const LikeController_1 = require("../controllers/LikeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  likeRoutes

  Arquivo responsável pelas rotas de curtidas.
*/
const likeRoutes = (0, express_1.Router)();
exports.likeRoutes = likeRoutes;
const likeController = new LikeController_1.LikeController();
/*
  POST /posts/:postId/like

  Essa rota precisa estar protegida.
  Somente usuários logados podem curtir.
*/
likeRoutes.post("/posts/:postId/like", authMiddleware_1.authMiddleware, likeController.toggle);
