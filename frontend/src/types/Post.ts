export interface PostMedia {
  id: string;
  mediaUrl: string;
  mediaType: "PHOTO" | "VIDEO";
}

export interface PostAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
  userType: "COMMON" | "INFLUENCER" | "BUSINESS";
  city?: string | null;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  city?: string | null;
  isClaimed: boolean;
}

export interface Post {
  id: string;
  title: string;
  description: string;

  postType: "REVIEW" | "PROMOTION" | "ADVERTISEMENT";

  recommendationRating?: string | number | null;
  priceRating?: string | number | null;
  flavorRating?: string | number | null;
  presentationRating?: string | number | null;

  /* NOVOS CAMPOS */
  serviceRating?: string | number | null;
  environmentRating?: string | number | null;

  averageRating?: string | number | null;

  createdAt: string;

  author: PostAuthor;
  businessProfile?: BusinessProfile | null;

  medias: PostMedia[];

  likes: unknown[];
  comments: unknown[];
}
