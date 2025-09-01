// src/types/index.ts
export type ProductCategory = "Crédito" | "Financiamiento" | "Inversión" | "All";
export type ProductSegment = "Personas" | "Empresas";

export interface Review {
  id: string;
  productId: string;
  userName: string;
  avatarUrl?: string; // Optional: URL for user avatar
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
  title?: string; // Optional: review title
}

export interface FinancialProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string; // For product detail page
  category: ProductCategory;
  segment: ProductSegment;
  imageUrl: string;
  provider: string; // e.g., "Bank Corp", "Invest Inc."
  features: string[];
  benefits?: string[]; // Optional: key benefits
  averageRating: number;
  reviewCount: number;
  
  // Detailed specs for comparison
  interestRate?: string; // e.g., "2.5% - 5.0% APR"
  loanTerm?: string; // e.g., "12-60 months"
  maxLoanAmount?: string; // e.g., "$50,000"
  coverageAmount?: string; // e.g., "Up to $1,000,000"
  investmentType?: string; // e.g., "Stocks, Bonds, ETFs"
  minInvestment?: string; // e.g., "$100"
  fees?: string; // e.g., "No annual fee", "1% management fee"
  eligibility?: string[]; // e.g., ["Minimum credit score 650", "US Resident"]
  
  // For UI hints
  aiHint?: string; // For placeholder image generation
  detailsUrl?: string; // Link to provider's product page
}
