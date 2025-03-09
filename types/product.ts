export type SearchableField =
  | 'price'
  | 'healthScore'
  | 'aiTags'
  | 'dietaryInfo'
  | 'priceCategory'
  | 'taste'
  | 'occasion'
  | 'ingredients'
  | 'is_to_share'
  | 'category';

export interface SearchFilter {
  field: SearchableField;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: string | number | boolean | string[];
}

export interface SearchQuery {
  filters: SearchFilter[];
  not?: SearchFilter[];
  orderBy?: Array<{
    field: SearchableField;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
}

export interface SearchResponse {
  query: SearchQuery;
  total: number;
  products: Product[];
  analysis: {
    relevantColumns: SearchableField[];
    explanation: string;
    availableValues: Record<SearchableField, any>;
  };
}

export interface StoreProductsRequest {
  store_url: string;
  limit?: number;
  offset?: number;
}

export interface StoreProductsResponse {
  store_url: string;
  total: number;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable: boolean;
  aiTags: string[];
  nutritionalValue: any;
  healthScore?: number;
  dietaryInfo: string[];
  priceCategory?: string;
  taste: string[];
  occasion: string[];
  ingredients: string[];
  is_to_share: boolean;
  restaurant: {
    name: string;
    url?: string;
  };
  deliveryInfo: {
    estimatedTime: number;
    deliveryFee?: number;
    isAvailable: boolean;
  } | null;
}

export interface CartItem extends Product {
  quantity: number;
}

