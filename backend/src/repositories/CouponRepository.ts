import { prisma } from "../database/prisma";
import { DiscountType } from "@prisma/client";

/*
  CouponRepository

  Camada responsável por acessar diretamente a tabela de cupons.

  Aqui fazemos operações de banco:
  - criar cupom
  - listar cupons
  - buscar cupom por código
  - ativar/desativar cupom
*/

interface CreateCouponData {
  businessProfileId: string;
  title: string;
  description?: string;
  code: string;
  discountType: DiscountType;
  discountValue?: number;
  validUntil?: Date;
}

export class CouponRepository {
  /*
    Cria um cupom para um empreendimento.
  */
  async create(data: CreateCouponData) {
    return prisma.coupon.create({
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
  async findByCode(code: string) {
    return prisma.coupon.findUnique({
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
    return prisma.coupon.findMany({
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
  async findByBusinessProfileId(businessProfileId: string) {
    return prisma.coupon.findMany({
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
  async findById(id: string) {
    return prisma.coupon.findUnique({
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
  async updateActiveStatus(id: string, isActive: boolean) {
    return prisma.coupon.update({
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
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      code?: string;
      discountType?: DiscountType;
      discountValue?: number;
      validUntil?: Date | null;
      isActive?: boolean;
    },
  ) {
    return prisma.coupon.update({
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
  async delete(id: string) {
    return prisma.coupon.delete({
      where: {
        id,
      },
    });
  }
}
