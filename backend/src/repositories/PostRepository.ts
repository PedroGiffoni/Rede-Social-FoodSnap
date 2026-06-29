import { prisma } from "../database/prisma";
import { MediaType, PostType, UserType } from "@prisma/client";

/*
  PostRepository

  Camada responsável por acessar diretamente o banco de dados
  para criar, buscar, filtrar e listar postagens.

  Regra importante:
  O Repository conversa com o Prisma.
  As regras de negócio ficam no Service.
*/

interface PostMediaData {
  mediaUrl: string;
  mediaType: MediaType;
}

interface CreatePostData {
  authorId: string;
  businessProfileId?: string;
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
  averageRating?: number;
  medias: PostMediaData[];
}

interface UpdatePostData {
  title: string;
  description: string;
  recommendationRating?: number;
  priceRating?: number;
  flavorRating?: number;
  presentationRating?: number;
  serviceRating?: number;
  environmentRating?: number;
  averageRating?: number;
}

interface SearchPostsFilters {
  term?: string;
  categoryId?: string;
  userType?: UserType;
  city?: string;
  sort?: "recent" | "rating" | "likes";
}

export class PostRepository {
  /*
    Bloco padrão de relacionamento.

    Usamos em vários métodos para sempre retornar:
    - autor
    - empreendimento
    - categoria
    - mídias
    - comentários
    - curtidas

    Isso facilita o frontend, porque o card do post já vem completo.
  */
  private defaultInclude = {
    author: {
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        userType: true,
        city: true,
      },
    },
    businessProfile: true,
    category: true,
    medias: true,
    comments: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            userType: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    },
    likes: true,
  };

  /*
    Cria uma postagem junto com suas mídias.

    Uma postagem pode ter de 1 até 5 mídias.
  */
  async create(data: CreatePostData) {
    return prisma.post.create({
      data: {
        authorId: data.authorId,
        businessProfileId: data.businessProfileId,
        categoryId: data.categoryId,
        postType: data.postType,
        title: data.title,
        description: data.description,
        recommendationRating: data.recommendationRating,
        priceRating: data.priceRating,
        flavorRating: data.flavorRating,
        presentationRating: data.presentationRating,
        averageRating: data.averageRating,
        serviceRating: data.serviceRating,
        environmentRating: data.environmentRating,
        medias: {
          create: data.medias.map((media) => ({
            mediaUrl: media.mediaUrl,
            mediaType: media.mediaType,
          })),
        },
      },
      include: this.defaultInclude,
    });
  }

  /*
    Lista o feed principal.

    Essa rota representa a tela inicial do app.
    Por padrão, mostramos posts mais recentes primeiro.
  */
  async findAll() {
    return prisma.post.findMany({
      include: this.defaultInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
    Base da aba Explorar.

    A ideia da aba Buscar/Explorar é abrir com uma quantidade
    de posts variados, parecido com o Instagram.

    Para o MVP, buscamos os últimos 50 posts e embaralhamos no Service.
    Futuramente podemos trocar por um algoritmo mais inteligente.
  */
  async findExploreBase() {
    return prisma.post.findMany({
      take: 50,
      include: this.defaultInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
    Busca uma postagem específica pelo ID.

    Usado na tela de detalhes do post.
  */
  async findById(id: string) {
    return prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            userType: true,
            city: true,
          },
        },
        businessProfile: true,
        category: true,
        medias: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                userType: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: true,
      },
    });
  }

  /*
    Lista postagens de um empreendimento específico.

    Usado no perfil do restaurante.
  */
  async findByBusinessProfileId(businessProfileId: string) {
    return prisma.post.findMany({
      where: {
        businessProfileId,
      },
      include: this.defaultInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
    Busca avançada da aba Buscar.

    Permite filtrar por:
    - termo livre
    - categoria
    - tipo de usuário: COMMON ou INFLUENCER
    - cidade
    - ordenação por recente, nota ou curtidas
  */
  async search(filters: SearchPostsFilters) {
    const where: any = {};

    /*
      Busca por texto.

      O termo pode encontrar:
      - título do post
      - descrição do post
      - nome do restaurante
      - nome do autor
      - nome da categoria
    */
    if (filters.term) {
      where.OR = [
        {
          title: {
            contains: filters.term,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.term,
            mode: "insensitive",
          },
        },
        {
          businessProfile: {
            businessName: {
              contains: filters.term,
              mode: "insensitive",
            },
          },
        },
        {
          author: {
            name: {
              contains: filters.term,
              mode: "insensitive",
            },
          },
        },
        {
          category: {
            name: {
              contains: filters.term,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    /*
      Filtro por categoria.

      No frontend, o ideal é enviar o categoryId.
    */
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    /*
      Filtro por tipo de usuário.

      Exemplo:
      userType=INFLUENCER
      userType=COMMON
    */
    if (filters.userType) {
      where.author = {
        ...(where.author || {}),
        userType: filters.userType,
      };
    }

    /*
      Filtro por cidade.

      Aqui usamos a cidade do autor.
      Futuramente também podemos filtrar pela cidade do restaurante.
    */
    if (filters.city) {
      where.author = {
        ...(where.author || {}),
        city: {
          contains: filters.city,
          mode: "insensitive",
        },
      };
    }

    /*
      Ordenação.

      recent = mais recentes
      rating = maior nota média
      likes = mais curtidos
    */
    let orderBy: any = {
      createdAt: "desc",
    };

    if (filters.sort === "rating") {
      orderBy = {
        averageRating: "desc",
      };
    }

    if (filters.sort === "likes") {
      orderBy = {
        likes: {
          _count: "desc",
        },
      };
    }

    return prisma.post.findMany({
      where,
      include: this.defaultInclude,
      orderBy,
    });
  }

  /*
  Lista posts dos perfis que o usuário logado segue.

  Exemplo:
  Pedro segue João e Chef Influencer.
  Então essa consulta retorna posts criados por João e Chef Influencer.

  Essa será a base do feed personalizado.
*/
  async findFeedFromFollowing(userId: string) {
    return prisma.post.findMany({
      where: {
        author: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      include: this.defaultInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
  Lista todas as postagens criadas por um usuário específico.

  Será usado na tela de perfil para mostrar:
  "Minhas postagens".
*/
  async findByAuthorId(authorId: string) {
    return prisma.post.findMany({
      where: {
        authorId,
      },
      include: this.defaultInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
  Busca uma postagem pelo ID.

  Utilizado para validar se o usuário é o dono
  antes de permitir exclusão.
*/
  async findSimpleById(id: string) {
    return prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  /*
  Remove uma postagem e seus dados relacionados.

  Apagamos primeiro os registros dependentes para evitar erro
  de relacionamento no banco.
*/
  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.comment.deleteMany({
        where: {
          postId: id,
        },
      });

      await tx.like.deleteMany({
        where: {
          postId: id,
        },
      });

      await tx.savedPost.deleteMany({
        where: {
          postId: id,
        },
      });

      await tx.postMedia.deleteMany({
        where: {
          postId: id,
        },
      });

      return tx.post.delete({
        where: {
          id,
        },
      });
    });
  }
  /*
  Atualiza os dados editáveis de uma postagem.

  Não alteramos mídia neste momento.
  A edição será apenas de:
  - título
  - descrição
  - notas
  - média
*/
  async update(id: string, data: UpdatePostData) {
    return prisma.post.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        recommendationRating: data.recommendationRating,
        priceRating: data.priceRating,
        flavorRating: data.flavorRating,
        presentationRating: data.presentationRating,
        serviceRating: data.serviceRating,
        environmentRating: data.environmentRating,
        averageRating: data.averageRating,
      },
      include: this.defaultInclude,
    });
  }
}
