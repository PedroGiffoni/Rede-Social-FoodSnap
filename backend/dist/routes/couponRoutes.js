"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoutes = void 0;
const express_1 = require("express");
const CouponController_1 = require("../controllers/CouponController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
/*
  couponRoutes

  Rotas do módulo de cupons.
*/
const couponRoutes = (0, express_1.Router)();
exports.couponRoutes = couponRoutes;
const couponController = new CouponController_1.CouponController();
/*
  GET /coupons

  Lista cupons ativos.
*/
couponRoutes.get("/", couponController.index);
/*
  GET /coupons/business/:businessProfileId

  Lista cupons de um empreendimento.
*/
couponRoutes.get("/business/:businessProfileId", couponController.listByBusiness);
/*
  POST /coupons

  Cria cupom.
  Precisa estar logado.
*/
couponRoutes.post("/", authMiddleware_1.authMiddleware, couponController.create);
/*
  PATCH /coupons/:couponId/toggle

  Ativa ou desativa cupom.
*/
couponRoutes.patch("/:couponId/toggle", authMiddleware_1.authMiddleware, couponController.toggle);
/*
  PATCH /coupons/:couponId

  Edita um cupom.
*/
couponRoutes.patch("/:couponId", authMiddleware_1.authMiddleware, couponController.update);
/*
  DELETE /coupons/:couponId

  Exclui um cupom.
*/
couponRoutes.delete("/:couponId", authMiddleware_1.authMiddleware, couponController.delete);
