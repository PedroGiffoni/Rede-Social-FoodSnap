"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const CommentService_1 = require("../services/CommentService");
/*
  CommentController

  Recebe as requisições HTTP de comentários
  e chama o CommentService.
*/
class CommentController {
    /*
      POST /posts/:postId/comments
  
      Cria um comentário em uma postagem.
  
      Precisa de token JWT.
    */
    async create(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const commentService = new CommentService_1.CommentService();
            const comment = await commentService.createComment({
                postId,
                userId: req.user?.id,
                content,
            });
            return res.status(201).json(comment);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao criar comentário.",
            });
        }
    }
    /*
      GET /posts/:postId/comments
  
      Lista todos os comentários de uma postagem.
  
      Não precisa de login.
    */
    async index(req, res) {
        try {
            const { postId } = req.params;
            const commentService = new CommentService_1.CommentService();
            const comments = await commentService.listCommentsByPost(postId);
            return res.status(200).json(comments);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error
                    ? error.message
                    : "Erro ao listar comentários.",
            });
        }
    }
}
exports.CommentController = CommentController;
