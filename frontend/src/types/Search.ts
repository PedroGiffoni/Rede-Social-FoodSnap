import type { Post } from "./Post";

export interface SearchUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  userType: "COMMON" | "INFLUENCER" | "BUSINESS";
}

export interface SearchBusiness {
  id: string;
  businessName: string;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  isClaimed: boolean;
}

export interface SearchCategory {
  id: string;
  name: string;
}

export interface GlobalSearchResult {
  term: string;
  users: SearchUser[];
  businesses: SearchBusiness[];
  posts: Post[];
  categories: SearchCategory[];
}
