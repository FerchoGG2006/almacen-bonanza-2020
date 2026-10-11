'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '../context/ShopContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';
import { CookieBanner } from './CookieBanner';
import { CartDrawer } from './CartDrawer';
import { ProductModal } from './ProductModal';
import { LegalModal } from './LegalModal';
import { DriveSyncModal } from './DriveSyncModal';
import { getViewUrl } from '../services/navigation';
import { ViewType } from '../types/index';
import { Check } from 'lucide-react';
import { formatCOP } from '../services/whatsapp';

export const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    products,
    cart,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    modalProductId,
    setModalProductId,
    isLegalOpen,
    setIsLegalOpen,
    legalTab,
    handleOpenLegal,
    isDriveSyncOpen,
    setIsDriveSyncOpen,
    toastNotification,
    handleAddToCart,
    handleUpdateCartQty,
    handleRemoveFromCart,
    handleCheckoutWhatsApp,
  } = useShop();

  // Deduce currentView from pathname
  let currentView: ViewType = 'home';
  if (pathname === '/tienda') currentView = 'tienda';
  else if (pathname === '/hombres') currentView = 'hombres';
  else if (pathname === '/mujeres') currentView = 'mujeres';
  else if (pathname === '/nosotros') currentView = 'nosotros';
  else if (pathname.startsWith('/producto')) currentView = 'producto';

  // Client-side fallback redirect for legacy query parameters (?view=... and ?id=...)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (idParam) {
      router.replace(`/producto/${idParam}`);
      return;
    }
    if (viewParam === 'tienda') {
      const cat = params.get('cat');
      router.replace(cat ? `/tienda?cat=${encodeURIComponent(cat)}` : '/tienda');
      return;
    }
    if (viewParam === 'hombres') {
      router.replace('/hombres');
      return;
    }
    if (viewParam === 'mujeres') {
      router.replace('/mujeres');
      return;
    }
    if (viewParam === 'nosotros') {
      router.replace('/nosotros');
      return;
    }
  }, [pathname, router]);

  const modalProduct = products.find((p) => p.id === modalProductId) || null;

  const handleNavigate = (view: ViewType, param?: string | number) => {
    const url = getViewUrl(view, param);
    router.push(url);
  };

  const handleFocusSearch = () => {
    if (pathname !== '/tienda') {
      router.push('/tienda?focus=search');
    } else {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  const cartCount = cart.reduce((c, item) => c + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] antialiased selection:bg-[#111111] selection:text-white flex flex-col justify-between">
      {/* Dynamic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleWishlistFilter={() => {
          if (pathname !== '/tienda') {
            router.push('/tienda?filter=wishlist');
          }
        }}
        isWishlistActive={false}
        onFocusSearch={handleFocusSearch}
      />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={handleOpenLegal}
        onOpenDriveSync={() => setIsDriveSyncOpen(true)}
      />

      {/* Slide-over Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckoutWhatsApp={handleCheckoutWhatsApp}
        onNavigateToTienda={() => {
          setIsCartOpen(false);
          router.push('/tienda');
        }}
        onOpenLegal={handleOpenLegal}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        isOpen={modalProductId !== null}
        product={modalProduct}
        onClose={() => setModalProductId(null)}
        onAddToCart={handleAddToCart}
        onOpenDetail={(id: number) => {
          setModalProductId(null);
          router.push(`/producto/${id}`);
        }}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        initialTab={legalTab}
        onClose={() => setIsLegalOpen(false)}
      />

      {/* Admin Google Drive Sync Modal */}
      <DriveSyncModal
        isOpen={isDriveSyncOpen}
        onClose={() => setIsDriveSyncOpen(false)}
        productsCount={products.length}
        products={products}
        onSyncSuccess={(_newProducts) => {
          window.location.reload();
        }}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloat />

      {/* Cookie & Habeas Data Consent Banner */}
      <CookieBanner onOpenPrivacyPolicy={() => handleOpenLegal('privacy')} />

      {/* Floating Add to Cart Confirmation Toast */}
      {toastNotification && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-neutral-950/95 backdrop-blur-md text-white border border-neutral-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4 max-w-sm">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
              <img
                src={toastNotification.image}
                alt={toastNotification.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 text-neutral-950 text-[9px] font-black px-1 rounded-tl">
                T.{toastNotification.size}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>¡Añadido a tu bolsa!</span>
              </div>
              <p className="text-xs font-semibold text-neutral-200 truncate mt-0.5">
                {toastNotification.name}
              </p>
              <p className="text-[10px] text-neutral-400">
                Bolsa ({toastNotification.totalCount} items)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Ver bolsa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
