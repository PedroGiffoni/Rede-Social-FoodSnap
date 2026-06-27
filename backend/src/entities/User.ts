export type UserType = "COMMON" | "INFLUENCER" | "BUSINESS";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}
