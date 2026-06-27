import { CommentRepository } from "../repositories/CommentRepository";
import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "./NotificationService";
/*
  CommentService

  Camada responsável pelas regras de negócio dos comentários.

  Regras:
  - usuário precisa existir
  - postagem precisa existir
  - comentário não pode ser vazio
  - qualquer tipo de usuário pode comentar:
    COMMON, INFLUENCER ou BUSINESS
*/

interface CreateCommentRequest {
  postId: string;
  userId: string;
  content: string;
}

export class CommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;
  constructor() {
    this.commentRepository = new CommentRepository();
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Cria um comentário em uma postagem.
  */
  async createComment(data: CreateCommentRequest) {
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
  async listCommentsByPost(postId: string) {
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
