import { Router } from "express";
import { SavedController } from "../controllers/SavedController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  savedRoutes

  Rotas de postagens e restaurantes salvos.
*/

const savedRoutes = Router();

const savedController = new SavedController();

/*
  Todas as rotas de salvos precisam de login.
*/
savedRoutes.use(authMiddleware);

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
savedRoutes.post(
  "/businesses/:businessProfileId",
  savedController.toggleBusiness,
);

/*
  GET /saved/businesses

  Lista restaurantes salvos.
*/
savedRoutes.get("/businesses", savedController.listBusinesses);

export { savedRoutes };
