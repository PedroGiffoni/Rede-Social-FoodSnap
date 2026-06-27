import { FollowRepository } from "../repositories/FollowRepository";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "./NotificationService";
/*
  FollowService

  Camada responsável pelas regras de negócio do sistema de seguidores.

  Regras:
  - usuário precisa estar logado
  - usuário seguido precisa existir
  - usuário não pode seguir a si mesmo
  - se já segue, deixa de seguir
  - se não segue, passa a seguir
*/

export class FollowService {
  private followRepository: FollowRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;
  constructor() {
    this.followRepository = new FollowRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Alterna o estado de seguir.

    Esse comportamento é parecido com o like:

    Se Pedro ainda não segue João:
    → cria o follow

    Se Pedro já segue João:
    → remove o follow
  */
  async toggleFollow(followerId: string, followingId: string) {
    if (!followerId) {
      throw new Error("Usuário não autenticado.");
    }

    if (!followingId) {
      throw new Error("Informe quem você deseja seguir.");
    }

    if (followerId === followingId) {
      throw new Error("Você não pode seguir a si mesmo.");
    }

    const follower = await this.userRepository.findById(followerId);

    if (!follower) {
      throw new Error("Usuário autenticado não encontrado.");
    }

    const following = await this.userRepository.findById(followingId);

    if (!following) {
      throw new Error("Usuário que você deseja seguir não foi encontrado.");
    }

    const existingFollow =
      await this.followRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    /*
      Se já existe follow, removemos.
    */
    if (existingFollow) {
      await this.followRepository.delete(existingFollow.id);

      const followersCount =
        await this.followRepository.countFollowers(followingId);

      const followingCount =
        await this.followRepository.countFollowing(followerId);

      return {
        following: false,
        message: "Você deixou de seguir este perfil.",
        followersCount,
        followingCount,
      };
    }

    /*
      Se ainda não existe follow, criamos.
    */
    await this.followRepository.create(followerId, followingId);

    const followersCount =
      await this.followRepository.countFollowers(followingId);

    const followingCount =
      await this.followRepository.countFollowing(followerId);

    await this.notificationService.createNotification({
      recipientId: followingId,
      actorId: followerId,
      type: "FOLLOW",
    });
    return {
      following: true,
      message: "Você começou a seguir este perfil.",
      followersCount,
      followingCount,
    };
  }

  /*
    Lista quem um usuário segue.
  */
  async listFollowing(userId: string) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return this.followRepository.listFollowing(userId);
  }

  /*
    Lista os seguidores de um usuário.
  */
  async listFollowers(userId: string) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return this.followRepository.listFollowers(userId);
  }

  /*
    Retorna os números de seguidores e seguindo.
  */
  async getFollowStats(userId: string) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const followersCount = await this.followRepository.countFollowers(userId);
    const followingCount = await this.followRepository.countFollowing(userId);

    return {
      userId,
      followersCount,
      followingCount,
    };
  }
}
