import { LikeRepository } from "../repositories/LikeRepository";
import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "./NotificationService";

/*
  LikeService

  Camada responsável pelas regras de negócio das curtidas.

  Regra escolhida:
  Todos os tipos de usuário podem curtir:
  - COMMON
  - INFLUENCER
  - BUSINESS

  Funcionamento:
  - Se o usuário ainda não curtiu, cria a curtida.
  - Se o usuário já curtiu, remove a curtida.
*/

export class LikeService {
  private likeRepository: LikeRepository;
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Alterna a curtida de uma postagem.

    Esse comportamento é chamado de toggle:
    - clicou uma vez: curte
    - clicou de novo: descurte
  */
  async toggleLike(userId: string, postId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    if (!postId) {
      throw new Error("ID da postagem é obrigatório.");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new Error("Postagem não encontrada.");
    }

    const existingLike = await this.likeRepository.findByUserAndPost(
      userId,
      postId,
    );

    /*
      Se já existe curtida, removemos.
    */
    if (existingLike) {
      await this.likeRepository.delete(existingLike.id);

      const likesCount = await this.likeRepository.countByPost(postId);

      return {
        likedByCurrentUser: false,
        likesCount,
      };
    }

    /*
      Se ainda não existe curtida, criamos.
    */
    await this.likeRepository.create(userId, postId);

    const likesCount = await this.likeRepository.countByPost(postId);

    await this.notificationService.createNotification({
      recipientId: post.authorId,
      actorId: userId,
      type: "LIKE",
      postId,
    });

    return {
      likedByCurrentUser: true,
      likesCount,
    };
  }
}
