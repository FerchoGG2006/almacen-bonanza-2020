export interface Product {
  id: number;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: number;
  original_price: number | null;
  image: string;
  hover_image: string;
  sizes: (number | string)[];
  available_sizes?: (number | string)[];
  tag: string | null;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  description: string;
}

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  qty: number;
}

export type ViewType = 'home' | 'tienda' | 'hombres' | 'mujeres' | 'nosotros' | 'producto';

export interface AppState {
  currentView: ViewType;
  selectedProductId?: number;
  category: string;
  gender: string;
  brand: string;
  size: string | number;
  search: string;
  sort: string;
  cart: CartItem[];
  wishlist: number[];
}

export interface HeroDrop {
  id: number;
  name: string;
  brand: string;
  price: number;
  spec1: string;
  sizes: number[];
  image: string;
  hover_image: string;
}
