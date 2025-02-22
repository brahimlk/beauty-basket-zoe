
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  discount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface GuestCartItem {
  product_id: string;
  quantity: number;
  product: Product;
}

export interface GuestOrder {
  email: string;
  full_name: string;
  items: GuestCartItem[];
}
