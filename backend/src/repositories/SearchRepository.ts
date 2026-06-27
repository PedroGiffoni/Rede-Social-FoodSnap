import { prisma } from "../database/prisma";

/*
  SearchRepository

  Responsável por buscar informações em várias tabelas ao mesmo tempo.

  Esta camada acessa diretamente o banco usando Prisma.
  A busca global procura por:
  - usuários
  - empreendimentos
  - postagens
  - categorias
*/

export class SearchRepository {
  /*
    Busca usuários pelo nome, cidade ou bio.
  */
  async searchUsers(term: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            bio: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        city: true,
        userType: true,
      },
      take: 10,
    });
  }

  /*
    Busca empreendimentos pelo nome, descrição, cidade ou endereço.
  */
  async searchBusinesses(term: string) {
    return prisma.businessProfile.findMany({
      where: {
        OR: [
          {
            businessName: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 10,
    });
  }

  /*
    Busca postagens pelo título, descrição, nome do restaurante,
    nome do autor ou categoria.
  */
  async searchPosts(term: string) {
    return prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            businessProfile: {
              businessName: {
                contains: term,
                mode: "insensitive",
              },
            },
          },
          {
            author: {
              name: {
                contains: term,
                mode: "insensitive",
              },
            },
          },
          {
            category: {
              name: {
                contains: term,
                mode: "insensitive",
              },
            },
          },
        ],
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
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  }

  /*
    Busca categorias pelo nome.
  */
  async searchCategories(term: string) {
    return prisma.category.findMany({
      where: {
        name: {
          contains: term,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
    });
  }
}
