import { prisma } from "../database/prisma";

/*
  BusinessRepository

  Camada responsável por acessar diretamente o banco de dados
  na tabela business_profiles.

  Nenhuma regra de negócio importante deve ficar aqui.
  O Repository apenas busca, cria e consulta dados.
*/

interface CreateBusinessData {
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  categoryId?: string;
  userId?: string;
  isClaimed?: boolean;
  claimedByUserId?: string;
}

export class BusinessRepository {
  /*
    Lista todos os empreendimentos cadastrados.
  */
  async findAll() {
    return prisma.businessProfile.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
      },
      orderBy: {
        businessName: "asc",
      },
    });
  }

  /*
    Busca empreendimentos pelo nome.
  */
  async findByName(name: string) {
    return prisma.businessProfile.findMany({
      where: {
        businessName: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        businessName: "asc",
      },
    });
  }

  /*
    Busca um empreendimento exato pelo nome.
  */
  async findExactByName(businessName: string) {
    return prisma.businessProfile.findFirst({
      where: {
        businessName: {
          equals: businessName,
          mode: "insensitive",
        },
      },
    });
  }

  /*
    Cria um novo empreendimento.
  */
  async create(data: CreateBusinessData) {
    return prisma.businessProfile.create({
      data: {
        businessName: data.businessName,
        description: data.description,
        address: data.address,
        city: data.city,
        phone: data.phone,
        website: data.website,
        openingHours: data.openingHours,
        categoryId: data.categoryId,
        userId: data.userId,
        isClaimed: data.isClaimed ?? false,
        claimedByUserId: data.claimedByUserId,
      },
      include: {
        category: true,
      },
    });
  }

  /*
    Busca empreendimento pelo ID.

    Usado para validar se o usuário logado é dono
    do empreendimento antes de criar cupons.
  */
  async findById(id: string) {
    return prisma.businessProfile.findUnique({
      where: {
        id,
      },
    });
  }

  /*
    Busca um empreendimento pelo ID trazendo relacionamentos.

    Usado na página pública do restaurante no frontend.
  */
  async findByIdWithRelations(id: string) {
    return prisma.businessProfile.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
      },
    });
  }
  /*
  Busca o restaurante pertencente ao usuário logado.

  Utilizado para abrir automaticamente
  o painel do restaurante.
*/
  async findByUserId(userId: string) {
    return prisma.businessProfile.findFirst({
      where: {
        userId,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
      },
    });
  }

  /*
  Atualiza as imagens do restaurante.
*/
  async updateImages(
    businessId: string,
    data: {
      avatarUrl?: string;
      coverUrl?: string;
    },
  ) {
    return prisma.businessProfile.update({
      where: {
        id: businessId,
      },
      data: {
        avatarUrl: data.avatarUrl,
        coverUrl: data.coverUrl,
      },
    });
  }

  /*
  Atualiza os dados do restaurante.
*/
  async updateBusiness(
    businessId: string,
    data: {
      businessName?: string;
      description?: string;
      address?: string;
      city?: string;
      website?: string;
      openingHours?: string;
    },
  ) {
    return prisma.businessProfile.update({
      where: {
        id: businessId,
      },
      data: {
        businessName: data.businessName,
        description: data.description,
        address: data.address,
        city: data.city,
        website: data.website,
        openingHours: data.openingHours,
      },
    });
  }
  /*
  Ranking de restaurantes.

  Ordena por quantidade de postagens.
*/
  async getRanking() {
    return prisma.businessProfile.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 20,
    });
  }
}
