import { Router } from "express";
import { CouponController } from "../controllers/CouponController";
import { authMiddleware } from "../middlewares/authMiddleware";

/*
  couponRoutes

  Rotas do módulo de cupons.
*/

const couponRoutes = Router();

const couponController = new CouponController();

/*
  GET /coupons

  Lista cupons ativos.
*/
couponRoutes.get("/", couponController.index);

/*
  GET /coupons/business/:businessProfileId

  Lista cupons de um empreendimento.
*/
couponRoutes.get(
  "/business/:businessProfileId",
  couponController.listByBusiness,
);

/*
  POST /coupons

  Cria cupom.
  Precisa estar logado.
*/
couponRoutes.post("/", authMiddleware, couponController.create);

/*
  PATCH /coupons/:couponId/toggle

  Ativa ou desativa cupom.
*/
couponRoutes.patch(
  "/:couponId/toggle",
  authMiddleware,
  couponController.toggle,
);
/*
  PATCH /coupons/:couponId

  Edita um cupom.
*/
couponRoutes.patch("/:couponId", authMiddleware, couponController.update);

/*
  DELETE /coupons/:couponId

  Exclui um cupom.
*/
couponRoutes.delete("/:couponId", authMiddleware, couponController.delete);
export { couponRoutes };
