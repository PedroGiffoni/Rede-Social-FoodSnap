"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const CommentRepository_1 = require("../repositories/CommentRepository");
const PostRepository_1 = require("../repositories/PostRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const NotificationService_1 = require("./NotificationService");
class CommentService {
    constructor() {
        this.commentRepository = new CommentRepository_1.CommentRepository();
        this.postRepository = new PostRepository_1.PostRepository();
        this.userRepository = new UserRepository_1.UserRepository();
        this.notificationService = new NotificationService_1.NotificationService();
    }
    /*
      Cria um comentário em uma postagem.
    */
    async createComment(data) {
        if (!data.userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!data.postId) {
            throw new Error("ID da postagem é obrigatório.");
        }
        if (!data.content || data.content.trim().length === 0) {
            throw new Error("O comentário não pode ser vazio.");
        }
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        const post = await this.postRepository.findById(data.postId);
        if (!post) {
            throw new Error("Postagem não encontrada.");
        }
        const comment = await this.commentRepository.create({
            postId: data.postId,
            userId: data.userId,
            content: data.content.trim(),
        });
        await this.notificationService.createNotification({
            recipientId: post.authorId,
            actorId: data.userId,
            type: "COMMENT",
            postId: data.postId,
            commentId: comment.id,
        });
        return comment;
    }
    /*
      Lista comentários de uma postagem.
    */
    async listCommentsByPost(postId) {
        if (!postId) {
            throw new Error("ID da postagem é obrigatório.");
        }
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error("Postagem não encontrada.");
        }
        return this.commentRepository.findByPostId(postId);
    }
}
exports.CommentService = CommentService;
