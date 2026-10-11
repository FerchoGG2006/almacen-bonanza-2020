'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types/index';
import { PRODUCTS_DATA } from '../data/products';
import { loadCartFromStorage, saveCartToStorage, loadWishlistFromStorage, saveWishlistToStorage } from '../services/storage';
import { buildCartWhatsAppUrl } from '../services/whatsapp';
import type { LegalTab } from '../components/LegalModal';
import { loadCachedDriveProducts, mergeCatalogs } from '../services/driveSync';
import {
  fetchPricesFromGoogleSheet,
  loadPricesFromCache,
  applySheetPricesToProducts,
} from '../services/googleSheetsPrices';
import { initAnalytics } from '../services/analytics';

export interface ToastNotificationData {
  name: string;
  image: string;
  size: string;
  totalCount: number;
}

interface ShopContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  wishlist: number[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalProductId: number | null;
  setModalProductId: (id: number | null) => void;
  isLegalOpen: boolean;
  setIsLegalOpen: (open: boolean) => void;
  legalTab: LegalTab;
  setLegalTab: (tab: LegalTab) => void;
  handleOpenLegal: (tab?: LegalTab) => void;
  isDriveSyncOpen: boolean;
  setIsDriveSyncOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toastNotification: ToastNotificationData | null;
  handleAddToCart: (productId: number, sizeVal: string | number) => void;
  handleUpdateCartQty: (index: number, delta: number) => void;
  handleRemoveFromCart: (index: number) => void;
  handleToggleWishlist: (productId: number) => void;
  handleCheckoutWhatsApp: (
    clientName: string,
    clientAddress: string,
    deliveryMethod: 'valledupar' | 'nacional',
    paymentMethod: 'contraentrega' | 'transferencia'
  ) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    let base = PRODUCTS_DATA;
    if (typeof window !== 'undefined') {
      const cached = loadCachedDriveProducts();
      if (cached.length > 0) {
        const { merged } = mergeCatalogs(PRODUCTS_DATA, cached);
        base = merged;
      }
      const cachedPrices = loadPricesFromCache();
      if (cachedPrices.size > 0) {
        return applySheetPricesToProducts(base, cachedPrices);
      }
    }
    return base;
  });

  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());
  const [wishlist, setWishlist] = useState<number[]>(() => loadWishlistFromStorage());

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [modalProductId, setModalProductId] = useState<number | null>(null);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');
  const [isDriveSyncOpen, setIsDriveSyncOpen] = useState<boolean>(false);

  const [toastNotification, setToastNotification] = useState<ToastNotificationData | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const handleOpenLegal = (tab: LegalTab = 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchPricesFromGoogleSheet().then((res) => {
      if (res.success && res.prices.size > 0) {
        setProducts((prev) => applySheetPricesToProducts(prev, res.prices));
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initAnalytics();
    const handleConsent = () => initAnalytics();
    window.addEventListener('cookie_consent_updated', handleConsent);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setModalProductId(null);
        setIsDriveSyncOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsDriveSyncOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('cookie_consent_updated', handleConsent);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (productId: number, sizeVal: string | number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const chosenSize = String(sizeVal);
    let newTotalCount = 0;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === productId && item.size === chosenSize);
      let nextCart: CartItem[];
      if (existingIdx > -1) {
        nextCart = [...prev];
        nextCart[existingIdx] = { ...nextCart[existingIdx], qty: nextCart[existingIdx].qty + 1 };
      } else {
        nextCart = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            size: chosenSize,
            qty: 1,
          },
        ];
      }
      newTotalCount = nextCart.reduce((sum, item) => sum + item.qty, 0);
      return nextCart;
    });

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastNotification({
      name: product.name,
      image: product.image,
      size: chosenSize,
      totalCount: newTotalCount || cart.reduce((sum, item) => sum + item.qty, 0) + 1,
    });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[index].qty + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...next[index], qty: newQty };
      }
      return next;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckoutWhatsApp = (
    clientName: string,
    clientAddress: string,
    deliveryMethod: 'valledupar' | 'nacional',
    paymentMethod: 'contraentrega' | 'transferencia'
  ) => {
    if (cart.length === 0) return;
    const waUrl = buildCartWhatsAppUrl(
      cart,
      clientName || 'Cliente',
      clientAddress || (deliveryMethod === 'valledupar' ? 'Valledupar' : 'Colombia'),
      deliveryMethod,
      paymentMethod
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        modalProductId,
        setModalProductId,
        isLegalOpen,
        setIsLegalOpen,
        legalTab,
        setLegalTab,
        handleOpenLegal,
        isDriveSyncOpen,
        setIsDriveSyncOpen,
        toastNotification,
        handleAddToCart,
        handleUpdateCartQty,
        handleRemoveFromCart,
        handleToggleWishlist,
        handleCheckoutWhatsApp,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
