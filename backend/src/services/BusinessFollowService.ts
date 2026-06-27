import { BusinessFollowRepository } from "../repositories/BusinessFollowRepository";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "./NotificationService";

/*
  BusinessFollowService

  Regras de negócio para seguir restaurantes.

  Funcionamento:
  - se o usuário ainda não segue, cria o vínculo
  - se já segue, remove o vínculo
  - notifica o dono do restaurante quando alguém começa a seguir
*/

export class BusinessFollowService {
  private businessFollowRepository: BusinessFollowRepository;
  private businessRepository: BusinessRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;

  constructor() {
    this.businessFollowRepository = new BusinessFollowRepository();
    this.businessRepository = new BusinessRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Segue ou deixa de seguir um restaurante.
  */
  async toggleFollowBusiness(userId: string, businessProfileId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    if (!businessProfileId) {
      throw new Error("ID do restaurante é obrigatório.");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const business = await this.businessRepository.findById(businessProfileId);

    if (!business) {
      throw new Error("Restaurante não encontrado.");
    }

    const existingFollow = await this.businessFollowRepository.find(
      userId,
      businessProfileId,
    );

    if (existingFollow) {
      await this.businessFollowRepository.delete(existingFollow.id);

      const followersCount =
        await this.businessFollowRepository.countFollowers(businessProfileId);

      return {
        following: false,
        followersCount,
        message: "Você deixou de seguir este restaurante.",
      };
    }

    await this.businessFollowRepository.create(userId, businessProfileId);

    const followersCount =
      await this.businessFollowRepository.countFollowers(businessProfileId);

    if (business.userId) {
      await this.notificationService.createNotification({
        recipientId: business.userId,
        actorId: userId,
        type: "FOLLOW",
        businessProfileId,
      });
    }

    return {
      following: true,
      followersCount,
      message: "Você começou a seguir este restaurante.",
    };
  }

  /*
    Conta seguidores de um restaurante.
  */
  async countFollowers(businessProfileId: string) {
    if (!businessProfileId) {
      throw new Error("ID do restaurante é obrigatório.");
    }

    return {
      businessProfileId,
      followersCount:
        await this.businessFollowRepository.countFollowers(businessProfileId),
    };
  }

  /*
    Lista restaurantes seguidos pelo usuário logado.
  */
  async listMyFollowedBusinesses(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.businessFollowRepository.listFollowedBusinesses(userId);
  }
  /*
  Lista seguidores de um restaurante.
*/
  async listBusinessFollowers(businessProfileId: string) {
    if (!businessProfileId) {
      throw new Error("ID do restaurante é obrigatório.");
    }

    return this.businessFollowRepository.listFollowers(businessProfileId);
  }
}
