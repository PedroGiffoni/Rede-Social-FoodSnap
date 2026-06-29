import { MediaType, PostType, UserType } from "@prisma/client";
import { PostRepository } from "../repositories/PostRepository";
import { UserRepository } from "../repositories/UserRepository";
import { BusinessRepository } from "../repositories/BusinessRepository";
import { NotificationService } from "./NotificationService";

/*
  PostService

  Camada responsável pelas regras de negócio das postagens.

  Aqui validamos:
  - usuário existe
  - tipo de usuário pode criar aquele tipo de post
  - postagem tem no mínimo 1 mídia e no máximo 5
  - notas estão entre 1.0 e 5.0
  - média da avaliação
  - regras da aba Buscar/Explorar
*/

interface PostMediaRequest {
  mediaUrl: string;
  mediaType: MediaType;
}

interface UpdatePostRequest {
  postId: string;
  userId: string;
  title: string;
  description: string;
  recommendationRating?: number;
  priceRating?: number;
  flavorRating?: number;
  presentationRating?: number;
  serviceRating?: number;
  environmentRating?: number;
}

interface CreatePostRequest {
  authorId: string;
  businessProfileId?: string;
  businessName?: string;
  categoryId?: string;
  postType: PostType;
  title: string;
  description: string;
  recommendationRating?: number;
  priceRating?: number;
  flavorRating?: number;
  presentationRating?: number;
  serviceRating?: number;
  environmentRating?: number;
  medias: PostMediaRequest[];
}

interface SearchPostsRequest {
  term?: string;
  categoryId?: string;
  userType?: string;
  city?: string;
  sort?: string;
}

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private businessRepository: BusinessRepository;
  private notificationService: NotificationService;
  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.businessRepository = new BusinessRepository();
    this.notificationService = new NotificationService();
  }

  /*
    Valida notas decimais de 1.0 até 5.0.
  */
  private validateRating(value: number | undefined, fieldName: string) {
    if (value === undefined || value === null) {
      throw new Error(`A nota ${fieldName} é obrigatória.`);
    }

    if (value < 1 || value > 5) {
      throw new Error(`A nota ${fieldName} deve estar entre 1.0 e 5.0.`);
    }

    const hasMoreThanOneDecimal = !Number.isInteger(value * 10);

    if (hasMoreThanOneDecimal) {
      throw new Error(
        `A nota ${fieldName} deve ter no máximo uma casa decimal.`,
      );
    }
  }

  /*
    Calcula a média das seis notas principais.
  */
  private calculateAverageRating(
    recommendationRating: number,
    priceRating: number,
    flavorRating: number,
    presentationRating: number,
    serviceRating: number,
    environmentRating: number,
  ) {
    const average =
      (recommendationRating +
        priceRating +
        flavorRating +
        presentationRating +
        serviceRating +
        environmentRating) /
      6;

    return Number(average.toFixed(1));
  }

  /*
    Embaralha uma lista.

    Usamos isso na aba Explorar para simular uma grade parecida
    com Instagram, onde os posts aparecem variados ao abrir a busca.
  */
  private shufflePosts<T>(posts: T[]) {
    return posts.sort(() => Math.random() - 0.5);
  }

  async createPost(data: CreatePostRequest) {
    const author = await this.userRepository.findById(data.authorId);

    if (!author) {
      throw new Error("Usuário autor da postagem não encontrado.");
    }

    if (!data.title) {
      throw new Error("Título da postagem é obrigatório.");
    }

    if (!data.description) {
      throw new Error("Descrição da postagem é obrigatória.");
    }

    if (!data.medias || data.medias.length === 0) {
      throw new Error("A postagem precisa ter pelo menos uma mídia.");
    }

    if (data.medias.length > 5) {
      throw new Error("A postagem pode ter no máximo 5 mídias.");
    }

    for (const media of data.medias) {
      if (!media.mediaUrl) {
        throw new Error("Toda mídia precisa ter uma URL.");
      }

      if (media.mediaType !== "PHOTO" && media.mediaType !== "VIDEO") {
        throw new Error("Tipo de mídia inválido. Use PHOTO ou VIDEO.");
      }
    }

    if (author.userType === "BUSINESS" && data.postType === "REVIEW") {
      throw new Error("Empreendimentos não podem criar avaliações.");
    }

    if (
      (author.userType === "COMMON" || author.userType === "INFLUENCER") &&
      data.postType !== "REVIEW"
    ) {
      throw new Error(
        "Usuários comuns e influenciadores só podem criar avaliações.",
      );
    }

    let businessProfileId = data.businessProfileId;

    if (data.postType === "REVIEW" && !businessProfileId) {
      if (!data.businessName) {
        throw new Error("Informe o nome do empreendimento avaliado.");
      }

      const existingBusiness = await this.businessRepository.findExactByName(
        data.businessName,
      );

      if (existingBusiness) {
        businessProfileId = existingBusiness.id;
      } else {
        const createdBusiness = await this.businessRepository.create({
          businessName: data.businessName,
          categoryId: data.categoryId,
          city: author.city || undefined,
          isClaimed: false,
        });

        businessProfileId = createdBusiness.id;
      }
    }

    let averageRating: number | undefined = undefined;

    if (data.postType === "REVIEW") {
      this.validateRating(data.recommendationRating, "indicaria");
      this.validateRating(data.priceRating, "preço");
      this.validateRating(data.flavorRating, "sabor");
      this.validateRating(data.presentationRating, "apresentação");
      this.validateRating(data.serviceRating, "atendimento");
      this.validateRating(data.environmentRating, "ambiente");

      averageRating = this.calculateAverageRating(
        data.recommendationRating as number,
        data.priceRating as number,
        data.flavorRating as number,
        data.presentationRating as number,
        data.serviceRating as number,
        data.environmentRating as number,
      );
    }

    const post = await this.postRepository.create({
      authorId: data.authorId,
      businessProfileId,
      categoryId: data.categoryId,
      postType: data.postType,
      title: data.title,
      description: data.description,
      recommendationRating: data.recommendationRating,
      priceRating: data.priceRating,
      flavorRating: data.flavorRating,
      presentationRating: data.presentationRating,
      serviceRating: data.serviceRating,
      environmentRating: data.environmentRating,
      averageRating,
      medias: data.medias,
    });

    /*
  Se a postagem marcou um restaurante reivindicado,
  notificamos o dono do restaurante.

  Exemplo:
  Pedro avaliou Josino's Burguer.
*/
    if (businessProfileId) {
      const business =
        await this.businessRepository.findById(businessProfileId);

      if (business?.userId) {
        await this.notificationService.createNotification({
          recipientId: business.userId,
          actorId: data.authorId,
          type: "SAVE_BUSINESS",
          postId: post.id,
          businessProfileId,
        });
      }
    }

    return post;
  }

  /*
    Lista o feed principal.

    Essa é a tela inicial do app, não a aba Buscar.
  */
  async listFeed() {
    return this.postRepository.findAll();
  }

  /*
    Lista posts aleatórios para a aba Explorar.

    Essa rota será usada quando o usuário abrir a aba Buscar,
    antes de digitar qualquer coisa.
  */
  async listExplorePosts() {
    const posts = await this.postRepository.findExploreBase();

    return this.shufflePosts(posts);
  }

  /*
    Busca postagens com filtros.

    Exemplos:
    /posts/search?term=burger
    /posts/search?userType=INFLUENCER
    /posts/search?sort=rating
    /posts/search?sort=likes
  */
  async searchPosts(filters: SearchPostsRequest) {
    let userType: UserType | undefined = undefined;

    if (filters.userType) {
      if (filters.userType !== "COMMON" && filters.userType !== "INFLUENCER") {
        throw new Error("userType deve ser COMMON ou INFLUENCER.");
      }

      userType = filters.userType as UserType;
    }

    let sort: "recent" | "rating" | "likes" | undefined = undefined;

    if (filters.sort) {
      if (
        filters.sort !== "recent" &&
        filters.sort !== "rating" &&
        filters.sort !== "likes"
      ) {
        throw new Error("sort deve ser recent, rating ou likes.");
      }

      sort = filters.sort as "recent" | "rating" | "likes";
    }

    return this.postRepository.search({
      term: filters.term,
      categoryId: filters.categoryId,
      userType,
      city: filters.city,
      sort,
    });
  }

  async getPostById(id: string) {
    if (!id) {
      throw new Error("ID da postagem é obrigatório.");
    }

    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error("Postagem não encontrada.");
    }

    return post;
  }

  async listPostsByBusiness(businessProfileId: string) {
    if (!businessProfileId) {
      throw new Error("ID do empreendimento é obrigatório.");
    }

    return this.postRepository.findByBusinessProfileId(businessProfileId);
  }
  /*
  Lista o feed personalizado do usuário logado.

  Esse feed mostra apenas posts de perfis que o usuário segue.
*/
  async listFollowingFeed(userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    return this.postRepository.findFeedFromFollowing(userId);
  }

  /*
  Lista postagens de um usuário específico.
*/
  async listPostsByUser(userId: string) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório.");
    }

    return this.postRepository.findByAuthorId(userId);
  }

  /*
  Exclui uma postagem.

  Apenas o autor da postagem pode remover.
*/
  async deletePost(postId: string, userId: string) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const post = await this.postRepository.findSimpleById(postId);

    if (!post) {
      throw new Error("Postagem não encontrada.");
    }

    if (post.authorId !== userId) {
      throw new Error("Você não tem permissão para excluir esta postagem.");
    }

    await this.postRepository.delete(postId);

    return {
      message: "Postagem removida com sucesso.",
    };
  }
  /*
  Edita uma postagem existente.

  Regras:
  - usuário precisa estar logado
  - postagem precisa existir
  - apenas o autor pode editar
  - título e descrição são obrigatórios
  - se for avaliação, recalculamos a média
*/
  async updatePost(data: UpdatePostRequest) {
    if (!data.userId) {
      throw new Error("Usuário não autenticado.");
    }

    if (!data.postId) {
      throw new Error("ID da postagem é obrigatório.");
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Título da postagem é obrigatório.");
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error("Descrição da postagem é obrigatória.");
    }

    const post = await this.postRepository.findSimpleById(data.postId);

    if (!post) {
      throw new Error("Postagem não encontrada.");
    }

    if (post.authorId !== data.userId) {
      throw new Error("Você não tem permissão para editar esta postagem.");
    }

    let averageRating: number | undefined = undefined;

    if (post.postType === "REVIEW") {
      this.validateRating(data.recommendationRating, "indicaria");
      this.validateRating(data.priceRating, "preço");
      this.validateRating(data.flavorRating, "sabor");
      this.validateRating(data.presentationRating, "apresentação");
      this.validateRating(data.serviceRating, "atendimento");
      this.validateRating(data.environmentRating, "ambiente");

      averageRating = this.calculateAverageRating(
        data.recommendationRating as number,
        data.priceRating as number,
        data.flavorRating as number,
        data.presentationRating as number,
        data.serviceRating as number,
        data.environmentRating as number,
      );
    }

    return this.postRepository.update(data.postId, {
      title: data.title.trim(),
      description: data.description.trim(),
      recommendationRating: data.recommendationRating,
      priceRating: data.priceRating,
      flavorRating: data.flavorRating,
      presentationRating: data.presentationRating,
      serviceRating: data.serviceRating,
      environmentRating: data.environmentRating,
      averageRating,
    });
  }
}
