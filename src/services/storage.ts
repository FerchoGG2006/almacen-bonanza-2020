import { CartItem } from '../types/index';

const CART_KEY = 'bonanza_cart';
const WISHLIST_KEY = 'bonanza_wishlist';

export function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading cart from storage', e);
  }
  return [];
}

export function saveCartToStorage(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to storage', e);
  }
}

export function loadWishlistFromStorage(): number[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading wishlist from storage', e);
  }
  return [];
}

export function saveWishlistToStorage(wishlist: number[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error('Error saving wishlist to storage', e);
  }
}
