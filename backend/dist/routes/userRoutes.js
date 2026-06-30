"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  Rotas de usuários.
*/
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userController = new UserController_1.UserController();
/*
  GET /users/search?term=pedro

  Busca usuários.
  Precisa vir antes de "/:id".
*/
userRoutes.get("/search", userController.search);
/*
  PATCH /users/avatar

  Atualiza a foto de perfil do usuário logado.
*/
userRoutes.patch("/avatar", authMiddleware_1.authMiddleware, userController.updateAvatar);
/*
  PATCH /users/profile

  Atualiza nome, bio e cidade do usuário logado.
*/
userRoutes.patch("/profile", authMiddleware_1.authMiddleware, userController.updateProfile);
/*
  GET /users/:id

  Perfil público do usuário.
*/
userRoutes.get("/:id", userController.show);
/*
  POST /users

  Cadastro.
*/
userRoutes.post("/", userController.create);
