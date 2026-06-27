import { Request, Response } from "express";
import { CouponService } from "../services/CouponService";

/*
  CouponController

  Recebe requisições HTTP relacionadas aos cupons
  e chama o CouponService.
*/

export class CouponController {
  /*
    POST /coupons

    Cria um cupom.
    Precisa estar logado como dono do empreendimento.
  */
  async create(req: Request, res: Response) {
    try {
      const {
        businessProfileId,
        title,
        description,
        code,
        discountType,
        discountValue,
        validUntil,
      } = req.body;

      const couponService = new CouponService();

      const coupon = await couponService.createCoupon({
        userId: req.user?.id as string,
        businessProfileId,
        title,
        description,
        code,
        discountType,
        discountValue,
        validUntil,
      });

      return res.status(201).json(coupon);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar cupom.",
      });
    }
  }

  /*
    GET /coupons

    Lista todos os cupons ativos.
  */
  async index(req: Request, res: Response) {
    try {
      const couponService = new CouponService();

      const coupons = await couponService.listActiveCoupons();

      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar cupons.",
      });
    }
  }

  /*
    GET /coupons/business/:businessProfileId

    Lista cupons de um empreendimento.
  */
  async listByBusiness(req: Request, res: Response) {
    try {
      const { businessProfileId } = req.params;

      const couponService = new CouponService();

      const coupons =
        await couponService.listCouponsByBusiness(businessProfileId);

      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao listar cupons do empreendimento.",
      });
    }
  }

  /*
    PATCH /coupons/:couponId/toggle

    Ativa ou desativa um cupom.
  */
  async toggle(req: Request, res: Response) {
    try {
      const { couponId } = req.params;

      const couponService = new CouponService();

      const coupon = await couponService.toggleCouponStatus(
        req.user?.id as string,
        couponId,
      );

      return res.status(200).json(coupon);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao alterar status do cupom.",
      });
    }
  }
}
