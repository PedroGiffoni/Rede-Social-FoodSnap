import type { Post } from "./Post";

export interface BusinessProfile {
  id: string;
  businessName: string;

  description?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  website?: string | null;
  openingHours?: string | null;

  avatarUrl?: string | null;
  coverUrl?: string | null;

  isClaimed: boolean;
}

export interface Coupon {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_ITEM";
  discountValue?: string | number | null;
  validUntil?: string | null;
  isActive: boolean;
}

export interface BusinessProfilePageData {
  business: BusinessProfile;
  posts: Post[];
  coupons: Coupon[];
}
