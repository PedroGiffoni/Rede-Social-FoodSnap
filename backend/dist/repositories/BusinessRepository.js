"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessRepository = void 0;
const prisma_1 = require("../database/prisma");
class BusinessRepository {
    /*
      Lista todos os empreendimentos cadastrados.
    */
    async findAll() {
        return prisma_1.prisma.businessProfile.findMany({
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
    async findByName(name) {
        return prisma_1.prisma.businessProfile.findMany({
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
    async findExactByName(businessName) {
        return prisma_1.prisma.businessProfile.findFirst({
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
    async create(data) {
        return prisma_1.prisma.businessProfile.create({
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
    async findById(id) {
        return prisma_1.prisma.businessProfile.findUnique({
            where: {
                id,
            },
        });
    }
    /*
      Busca um empreendimento pelo ID trazendo relacionamentos.
  
      Usado na página pública do restaurante no frontend.
    */
    async findByIdWithRelations(id) {
        return prisma_1.prisma.businessProfile.findUnique({
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
    async findByUserId(userId) {
        return prisma_1.prisma.businessProfile.findFirst({
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
    async updateImages(businessId, data) {
        return prisma_1.prisma.businessProfile.update({
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
    async updateBusiness(businessId, data) {
        return prisma_1.prisma.businessProfile.update({
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
        return prisma_1.prisma.businessProfile.findMany({
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
exports.BusinessRepository = BusinessRepository;
