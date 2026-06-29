import { api } from "../api/api";
import type { Coupon } from "../types/Business";

/*
  Cria um cupom.
*/
export async function createCoupon(data: {
  businessProfileId: string;
  title: string;
  description?: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_ITEM";
  discountValue?: number;
  validUntil?: string;
}) {
  const response = await api.post("/coupons", data);

  return response.data;
}

/*
  Lista cupons de um restaurante.
*/
export async function getCouponsByBusiness(businessProfileId: string) {
  const response = await api.get<Coupon[]>(
    `/coupons/business/${businessProfileId}`,
  );

  return response.data;
}

/*
  Ativa ou desativa um cupom.
*/
export async function toggleCoupon(couponId: string) {
  const response = await api.patch(`/coupons/${couponId}/toggle`);

  return response.data;
}

/*
  Edita um cupom existente.
*/
export async function updateCoupon(
  couponId: string,
  data: {
    title: string;
    description?: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED" | "FREE_ITEM";
    discountValue?: number;
    validUntil?: string;
    isActive?: boolean;
  },
) {
  const response = await api.patch(`/coupons/${couponId}`, data);

  return response.data;
}

/*
  Exclui um cupom existente.
*/
export async function deleteCoupon(couponId: string) {
  const response = await api.delete(`/coupons/${couponId}`);

  return response.data;
}
