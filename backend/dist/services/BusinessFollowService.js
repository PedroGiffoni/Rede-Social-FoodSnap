"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessFollowService = void 0;
const BusinessFollowRepository_1 = require("../repositories/BusinessFollowRepository");
const BusinessRepository_1 = require("../repositories/BusinessRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const NotificationService_1 = require("./NotificationService");
/*
  BusinessFollowService

  Regras de negócio para seguir restaurantes.

  Funcionamento:
  - se o usuário ainda não segue, cria o vínculo
  - se já segue, remove o vínculo
  - notifica o dono do restaurante quando alguém começa a seguir
*/
class BusinessFollowService {
    constructor() {
        this.businessFollowRepository = new BusinessFollowRepository_1.BusinessFollowRepository();
        this.businessRepository = new BusinessRepository_1.BusinessRepository();
        this.userRepository = new UserRepository_1.UserRepository();
        this.notificationService = new NotificationService_1.NotificationService();
    }
    /*
      Segue ou deixa de seguir um restaurante.
    */
    async toggleFollowBusiness(userId, businessProfileId) {
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
        const existingFollow = await this.businessFollowRepository.find(userId, businessProfileId);
        if (existingFollow) {
            await this.businessFollowRepository.delete(existingFollow.id);
            const followersCount = await this.businessFollowRepository.countFollowers(businessProfileId);
            return {
                following: false,
                followersCount,
                message: "Você deixou de seguir este restaurante.",
            };
        }
        await this.businessFollowRepository.create(userId, businessProfileId);
        const followersCount = await this.businessFollowRepository.countFollowers(businessProfileId);
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
    async countFollowers(businessProfileId) {
        if (!businessProfileId) {
            throw new Error("ID do restaurante é obrigatório.");
        }
        return {
            businessProfileId,
            followersCount: await this.businessFollowRepository.countFollowers(businessProfileId),
        };
    }
    /*
      Lista restaurantes seguidos pelo usuário logado.
    */
    async listMyFollowedBusinesses(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return this.businessFollowRepository.listFollowedBusinesses(userId);
    }
    /*
    Lista seguidores de um restaurante.
  */
    async listBusinessFollowers(businessProfileId) {
        if (!businessProfileId) {
            throw new Error("ID do restaurante é obrigatório.");
        }
        return this.businessFollowRepository.listFollowers(businessProfileId);
    }
    /*
    Verifica se o usuário logado já segue um restaurante.
  
    Usado na página pública do restaurante para manter
    o botão "Seguir/Seguindo" correto mesmo após recarregar a página.
  */
    async checkIfUserFollowsBusiness(userId, businessProfileId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!businessProfileId) {
            throw new Error("ID do restaurante é obrigatório.");
        }
        const follow = await this.businessFollowRepository.find(userId, businessProfileId);
        return {
            following: !!follow,
        };
    }
}
exports.BusinessFollowService = BusinessFollowService;
