export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  url: string;
  image?: string;
  description?: string;
  category?: string;
  priceCategory?: string;
  isAvailable?: boolean;
  restaurant?: {
    name: string;
  };
  deliveryInfo?: {
    deliveryFee?: number;
  };
} 