// src/lib/schema/types.ts
// Tipos TypeScript para Schema.org

export interface SchemaOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization' | 'FinancialService';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[]; // Redes sociales
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
}

export interface SchemaWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface SchemaBreadcrumb {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface SchemaProduct {
  '@context': 'https://schema.org';
  '@type': 'FinancialProduct' | 'CreditCard' | 'LoanOrCredit' | 'InvestmentOrDeposit' | 'BankAccount';
  name: string;
  description?: string;
  brand?: {
    '@type': 'Brand' | 'Organization';
    name: string;
    logo?: string;
  };
  image?: string;
  url?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  offers?: {
    '@type': 'Offer';
    url?: string;
    priceCurrency?: string;
    price?: number;
  };
  // Campos específicos por tipo
  annualPercentageRate?: number;
  feesAndCommissionsSpecification?: string;
  interestRate?: string;
  amount?: {
    '@type': 'MonetaryAmount';
    minValue?: number;
    maxValue?: number;
    currency?: string;
  };
}

export interface SchemaArticle {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'NewsArticle' | 'BlogPosting';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface SchemaFAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface SchemaItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  name?: string;
  description?: string;
  numberOfItems: number;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    item: SchemaProduct;
  }>;
}

export interface SchemaReview {
  '@context': 'https://schema.org';
  '@type': 'Review';
  itemReviewed: SchemaProduct;
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody?: string;
  datePublished?: string;
}

export interface SchemaSoftwareApplication {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  description?: string;
  offers?: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}
