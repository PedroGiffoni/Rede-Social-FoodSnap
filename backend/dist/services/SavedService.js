"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedService = void 0;
const SavedRepository_1 = require("../repositories/SavedRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const PostRepository_1 = require("../repositories/PostRepository");
const BusinessRepository_1 = require("../repositories/BusinessRepository");
const NotificationService_1 = require("./NotificationService");
/*
  SavedService

  Camada responsável pelas regras de negócio de favoritos.

  Regras:
  - usuário precisa estar logado
  - post precisa existir para ser salvo
  - restaurante precisa existir para ser salvo
  - se já está salvo, remove
  - se não está salvo, salva
*/
class SavedService {
    constructor() {
        this.savedRepository = new SavedRepository_1.SavedRepository();
        this.userRepository = new UserRepository_1.UserRepository();
        this.postRepository = new PostRepository_1.PostRepository();
        this.businessRepository = new BusinessRepository_1.BusinessRepository();
        this.notificationService = new NotificationService_1.NotificationService();
    }
    /*
      Salva ou remove uma postagem dos favoritos.
  
      Funciona como toggle:
      - se não estava salvo, salva
      - se já estava salvo, remove
    */
    async toggleSavedPost(userId, postId) {
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
        const existingSavedPost = await this.savedRepository.findSavedPost(userId, postId);
        if (existingSavedPost) {
            await this.savedRepository.unsavePost(existingSavedPost.id);
            return {
                saved: false,
                message: "Postagem removida dos salvos.",
            };
        }
        await this.savedRepository.savePost(userId, postId);
        return {
            saved: true,
            message: "Postagem salva com sucesso.",
        };
    }
    /*
      Lista as postagens salvas do usuário logado.
    */
    async listSavedPosts(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return this.savedRepository.listSavedPosts(userId);
    }
    /*
      Salva ou remove um restaurante dos favoritos.
    */
    async toggleSavedBusiness(userId, businessProfileId) {
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
        const existingSavedBusiness = await this.savedRepository.findSavedBusiness(userId, businessProfileId);
        if (existingSavedBusiness) {
            await this.savedRepository.unsaveBusiness(existingSavedBusiness.id);
            return {
                saved: false,
                message: "Restaurante removido dos salvos.",
            };
        }
        await this.savedRepository.saveBusiness(userId, businessProfileId);
        if (business.userId) {
            await this.notificationService.createNotification({
                recipientId: business.userId,
                actorId: userId,
                type: "SAVE_BUSINESS",
                businessProfileId,
            });
            return {
                saved: true,
                message: "Restaurante salvo com sucesso.",
            };
        }
    }
    /*
      Lista os restaurantes salvos do usuário logado.
    */
    async listSavedBusinesses(userId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        return this.savedRepository.listSavedBusinesses(userId);
    }
}
exports.SavedService = SavedService;
