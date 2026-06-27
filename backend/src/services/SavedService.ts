import { SavedRepository } from "../repositories/SavedRepository";
import { UserRepository } from "../repositories/UserRepository";
import { PostRepository } from "../repositories/PostRepository";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { NotificationService } from "./NotificationService";
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

export class SavedService {
  private savedRepository: SavedRepository;
  private userRepository: UserRepository;
  private postRepository: PostRepository;
  private businessRepository: BusinessRepository;
  private notificationService: NotificationService;
  constructor() {
    this.savedRepository = new SavedRepository();
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
    this.businessRepository = new BusinessRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Salva ou remove uma postagem dos favoritos.

    Funciona como toggle:
    - se não estava salvo, salva
    - se já estava salvo, remove
  */
  async toggleSavedPost(userId: string, postId: string) {
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

    const existingSavedPost = await this.savedRepository.findSavedPost(
      userId,
      postId,
    );

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
  async listSavedPosts(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.savedRepository.listSavedPosts(userId);
  }

  /*
    Salva ou remove um restaurante dos favoritos.
  */
  async toggleSavedBusiness(userId: string, businessProfileId: string) {
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

    const existingSavedBusiness = await this.savedRepository.findSavedBusiness(
      userId,
      businessProfileId,
    );

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
  async listSavedBusinesses(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.savedRepository.listSavedBusinesses(userId);
  }
}
