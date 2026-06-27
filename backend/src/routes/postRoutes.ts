import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  postRoutes

  Rotas de postagens.

  Ordem importante:
  Rotas específicas como /explore e /search precisam vir antes de /:id.
*/

const postRoutes = Router();

const postController = new PostController();

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
postRoutes.get("/following/feed", authMiddleware, postController.followingFeed);

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
postRoutes.patch("/:id", authMiddleware, postController.update);

/*
  POST /posts

  Cria postagem.
  Precisa estar logado.
*/

/*
  DELETE /posts/:id

  Remove uma postagem.
*/
postRoutes.delete("/:id", authMiddleware, postController.delete);

postRoutes.post("/", authMiddleware, postController.create);

export { postRoutes };
