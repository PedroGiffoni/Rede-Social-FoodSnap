"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const PostService_1 = require("../services/PostService");
/*
  PostController

  Recebe as requisições HTTP relacionadas a postagens
  e encaminha para o PostService.

  O Controller não deve conter regra de negócio pesada.
*/
class PostController {
    /*
      POST /posts
  
      Cria uma nova postagem.
    */
    async create(req, res) {
        try {
            const { businessProfileId, businessName, categoryId, postType, title, description, recommendationRating, priceRating, flavorRating, presentationRating, serviceRating, environmentRating, medias, } = req.body;
            const postService = new PostService_1.PostService();
            const post = await postService.createPost({
                authorId: req.user?.id,
                businessProfileId,
                businessName,
                categoryId,
                postType,
                title,
                description,
                recommendationRating,
                priceRating,
                flavorRating,
                presentationRating,
                serviceRating,
                environmentRating,
                medias,
            });
            return res.status(201).json(post);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao criar postagem.",
            });
        }
    }
    /*
      GET /posts
  
      Feed principal do app.
    */
    async index(req, res) {
        try {
            const postService = new PostService_1.PostService();
            const posts = await postService.listFeed();
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao listar postagens.",
            });
        }
    }
    /*
      GET /posts/explore
  
      Aba Buscar/Explorar.
  
      Quando o usuário entra na aba Buscar, antes de digitar qualquer coisa,
      mostramos posts variados/aleatórios.
    */
    async explore(req, res) {
        try {
            const postService = new PostService_1.PostService();
            const posts = await postService.listExplorePosts();
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(500).json({
                message: "Erro ao carregar aba Explorar.",
            });
        }
    }
    /*
      GET /posts/search
  
      Busca com filtros.
  
      Exemplos:
      /posts/search?term=burger
      /posts/search?userType=INFLUENCER
      /posts/search?userType=COMMON
      /posts/search?city=Fortaleza
      /posts/search?sort=rating
      /posts/search?sort=likes
    */
    async search(req, res) {
        try {
            const { term, categoryId, userType, city, sort } = req.query;
            const postService = new PostService_1.PostService();
            const posts = await postService.searchPosts({
                term: term ? String(term) : undefined,
                categoryId: categoryId ? String(categoryId) : undefined,
                userType: userType ? String(userType) : undefined,
                city: city ? String(city) : undefined,
                sort: sort ? String(sort) : undefined,
            });
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao buscar postagens.",
            });
        }
    }
    /*
      GET /posts/:id
  
      Busca uma postagem específica pelo ID.
    */
    async show(req, res) {
        try {
            const { id } = req.params;
            const postService = new PostService_1.PostService();
            const post = await postService.getPostById(id);
            return res.status(200).json(post);
        }
        catch (error) {
            return res.status(404).json({
                message: error instanceof Error ? error.message : "Postagem não encontrada.",
            });
        }
    }
    /*
      GET /posts/business/:businessProfileId
  
      Lista todas as postagens relacionadas a um empreendimento.
    */
    async listByBusiness(req, res) {
        try {
            const { businessProfileId } = req.params;
            const postService = new PostService_1.PostService();
            const posts = await postService.listPostsByBusiness(businessProfileId);
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar postagens do empreendimento.",
            });
        }
    }
    /*
    GET /posts/following/feed
  
    Feed personalizado do usuário logado.
  */
    async followingFeed(req, res) {
        try {
            const postService = new PostService_1.PostService();
            const posts = await postService.listFollowingFeed(req.user?.id);
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao carregar feed personalizado.",
            });
        }
    }
    /*
    GET /posts/user/:userId
  
    Lista todas as postagens feitas por um usuário.
  */
    async listByUser(req, res) {
        try {
            const { userId } = req.params;
            const postService = new PostService_1.PostService();
            const posts = await postService.listPostsByUser(userId);
            return res.status(200).json(posts);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar postagens do usuário.",
            });
        }
    }
    /*
    DELETE /posts/:id
  
    Remove uma postagem do usuário logado.
  */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const postService = new PostService_1.PostService();
            const result = await postService.deletePost(id, req.user?.id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao excluir postagem.",
            });
        }
    }
    /*
    PATCH /posts/:id
  
    Edita uma postagem do usuário logado.
  */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, recommendationRating, priceRating, flavorRating, presentationRating, serviceRating, environmentRating, } = req.body;
            const postService = new PostService_1.PostService();
            const post = await postService.updatePost({
                postId: id,
                userId: req.user?.id,
                title,
                description,
                recommendationRating,
                priceRating,
                flavorRating,
                presentationRating,
                serviceRating,
                environmentRating,
            });
            return res.status(200).json(post);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao editar postagem.",
            });
        }
    }
}
exports.PostController = PostController;
