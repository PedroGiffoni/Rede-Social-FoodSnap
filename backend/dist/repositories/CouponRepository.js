"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRepository = void 0;
const prisma_1 = require("../database/prisma");
class CouponRepository {
    /*
      Cria um cupom para um empreendimento.
    */
    async create(data) {
        return prisma_1.prisma.coupon.create({
            data,
            include: {
                businessProfile: true,
            },
        });
    }
    /*
      Busca cupom pelo código.
  
      Usado para impedir códigos duplicados.
    */
    async findByCode(code) {
        return prisma_1.prisma.coupon.findUnique({
            where: {
                code,
            },
        });
    }
    /*
      Lista todos os cupons ativos.
  
      Usado na aba de promoções/cupons do app.
    */
    async findActiveCoupons() {
        return prisma_1.prisma.coupon.findMany({
            where: {
                isActive: true,
            },
            include: {
                businessProfile: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /*
      Lista cupons de um empreendimento específico.
    */
    async findByBusinessProfileId(businessProfileId) {
        return prisma_1.prisma.coupon.findMany({
            where: {
                businessProfileId,
            },
            include: {
                businessProfile: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /*
      Busca cupom por ID.
    */
    async findById(id) {
        return prisma_1.prisma.coupon.findUnique({
            where: {
                id,
            },
            include: {
                businessProfile: true,
            },
        });
    }
    /*
      Ativa ou desativa um cupom.
    */
    async updateActiveStatus(id, isActive) {
        return prisma_1.prisma.coupon.update({
            where: {
                id,
            },
            data: {
                isActive,
            },
            include: {
                businessProfile: true,
            },
        });
    }
    /*
    Atualiza dados de um cupom.
  */
    async update(id, data) {
        return prisma_1.prisma.coupon.update({
            where: {
                id,
            },
            data,
            include: {
                businessProfile: true,
            },
        });
    }
    /*
    Exclui um cupom.
  */
    async delete(id) {
        return prisma_1.prisma.coupon.delete({
            where: {
                id,
            },
        });
    }
}
exports.CouponRepository = CouponRepository;
