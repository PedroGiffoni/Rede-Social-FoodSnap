import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  Rotas de usuários.
*/

const userRoutes = Router();

const userController = new UserController();

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
userRoutes.patch("/avatar", authMiddleware, userController.updateAvatar);

/*
  PATCH /users/profile

  Atualiza nome, bio e cidade do usuário logado.
*/
userRoutes.patch("/profile", authMiddleware, userController.updateProfile);

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

export { userRoutes };
