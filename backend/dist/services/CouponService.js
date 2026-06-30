"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const BusinessRepository_1 = require("../repositories/BusinessRepository");
const CouponRepository_1 = require("../repositories/CouponRepository");
class CouponService {
    constructor() {
        this.couponRepository = new CouponRepository_1.CouponRepository();
        this.businessRepository = new BusinessRepository_1.BusinessRepository();
    }
    /*
      Valida se o tipo de desconto é aceito.
    */
    validateDiscountType(discountType) {
        const allowedTypes = ["PERCENTAGE", "FIXED", "FREE_ITEM"];
        if (!allowedTypes.includes(discountType)) {
            throw new Error("Tipo de desconto inválido.");
        }
    }
    /*
      Cria um novo cupom.
    */
    async createCoupon(data) {
        if (!data.userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!data.businessProfileId) {
            throw new Error("ID do empreendimento é obrigatório.");
        }
        if (!data.title) {
            throw new Error("Título do cupom é obrigatório.");
        }
        if (!data.code) {
            throw new Error("Código do cupom é obrigatório.");
        }
        this.validateDiscountType(data.discountType);
        const business = await this.businessRepository.findById(data.businessProfileId);
        if (!business) {
            throw new Error("Empreendimento não encontrado.");
        }
        /*
          Apenas empreendimento reivindicado pode criar cupom.
        */
        if (!business.isClaimed) {
            throw new Error("Este empreendimento ainda não foi reivindicado.");
        }
        /*
          O usuário logado precisa ser dono do empreendimento.
        */
        if (business.userId !== data.userId) {
            throw new Error("Você não tem permissão para criar cupom neste empreendimento.");
        }
        const existingCoupon = await this.couponRepository.findByCode(data.code.toUpperCase());
        if (existingCoupon) {
            throw new Error("Já existe um cupom com este código.");
        }
        return this.couponRepository.create({
            businessProfileId: data.businessProfileId,
            title: data.title,
            description: data.description,
            code: data.code.toUpperCase(),
            discountType: data.discountType,
            discountValue: data.discountValue,
            validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        });
    }
    /*
      Lista cupons ativos.
    */
    async listActiveCoupons() {
        return this.couponRepository.findActiveCoupons();
    }
    /*
      Lista cupons de um empreendimento.
    */
    async listCouponsByBusiness(businessProfileId) {
        if (!businessProfileId) {
            throw new Error("ID do empreendimento é obrigatório.");
        }
        return this.couponRepository.findByBusinessProfileId(businessProfileId);
    }
    /*
      Ativa ou desativa um cupom.
    */
    async toggleCouponStatus(userId, couponId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!couponId) {
            throw new Error("ID do cupom é obrigatório.");
        }
        const coupon = await this.couponRepository.findById(couponId);
        if (!coupon) {
            throw new Error("Cupom não encontrado.");
        }
        if (coupon.businessProfile.userId !== userId) {
            throw new Error("Você não tem permissão para alterar este cupom.");
        }
        return this.couponRepository.updateActiveStatus(couponId, !coupon.isActive);
    }
    /*
    Edita um cupom existente.
  */
    async updateCoupon(data) {
        if (!data.userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!data.couponId) {
            throw new Error("ID do cupom é obrigatório.");
        }
        if (!data.title) {
            throw new Error("Título do cupom é obrigatório.");
        }
        if (!data.code) {
            throw new Error("Código do cupom é obrigatório.");
        }
        this.validateDiscountType(data.discountType);
        const coupon = await this.couponRepository.findById(data.couponId);
        if (!coupon) {
            throw new Error("Cupom não encontrado.");
        }
        if (coupon.businessProfile.userId !== data.userId) {
            throw new Error("Você não tem permissão para editar este cupom.");
        }
        const normalizedCode = data.code.toUpperCase();
        if (normalizedCode !== coupon.code) {
            const existingCoupon = await this.couponRepository.findByCode(normalizedCode);
            if (existingCoupon) {
                throw new Error("Já existe um cupom com este código.");
            }
        }
        return this.couponRepository.update(data.couponId, {
            title: data.title,
            description: data.description,
            code: normalizedCode,
            discountType: data.discountType,
            discountValue: data.discountValue,
            validUntil: data.validUntil ? new Date(data.validUntil) : null,
            isActive: data.isActive,
        });
    }
    /*
    Exclui um cupom existente.
  */
    async deleteCoupon(userId, couponId) {
        if (!userId) {
            throw new Error("Usuário não autenticado.");
        }
        if (!couponId) {
            throw new Error("ID do cupom é obrigatório.");
        }
        const coupon = await this.couponRepository.findById(couponId);
        if (!coupon) {
            throw new Error("Cupom não encontrado.");
        }
        if (coupon.businessProfile.userId !== userId) {
            throw new Error("Você não tem permissão para excluir este cupom.");
        }
        await this.couponRepository.delete(couponId);
        return {
            message: "Cupom excluído com sucesso.",
        };
    }
}
exports.CouponService = CouponService;
