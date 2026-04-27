/**
 * Shared types — mirrors the MongoDB schemas in /BACKEND.md.
 * Each `_id` maps to Mongo's ObjectId.
 */

export interface PortfolioCompany {
  _id: string;
  name: string;
  logo: string; // url or data url
  description: string;
  sector: string;
  website: string;
  createdAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  createdAt: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  body: string;
  createdAt: string;
}

export interface PageSection {
  heading: string;
  body: string;
}

export interface PageContent {
  _id: string;
  slug: string;
  title: string;
  sections: PageSection[];
  updatedAt: string;
}

export interface Settings {
  _id: string;
  brandName: string;
  contactEmail: string;
  logoUrl: string;
  social: { twitter?: string; linkedin?: string };
}

export interface AdminUser {
  _id: string;
  email: string;
  passwordHash: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
}
