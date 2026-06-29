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
  /*
  PATCH /coupons/:couponId

  Edita um cupom existente.
*/
  async update(req: Request, res: Response) {
    try {
      const { couponId } = req.params;

      const {
        title,
        description,
        code,
        discountType,
        discountValue,
        validUntil,
        isActive,
      } = req.body;

      const couponService = new CouponService();

      const coupon = await couponService.updateCoupon({
        userId: req.user?.id as string,
        couponId,
        title,
        description,
        code,
        discountType,
        discountValue,
        validUntil,
        isActive,
      });

      return res.status(200).json(coupon);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao editar cupom.",
      });
    }
  }

  /*
  DELETE /coupons/:couponId

  Exclui um cupom existente.
*/
  async delete(req: Request, res: Response) {
    try {
      const { couponId } = req.params;

      const couponService = new CouponService();

      const result = await couponService.deleteCoupon(
        req.user?.id as string,
        couponId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao excluir cupom.",
      });
    }
  }
}
