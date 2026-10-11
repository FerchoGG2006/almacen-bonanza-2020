import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ViewType, Product, CartItem } from './types/index';
import { PRODUCTS_DATA } from './data/products';
import { loadCartFromStorage, saveCartToStorage, loadWishlistFromStorage, saveWishlistToStorage } from './services/storage';
import { buildCartWhatsAppUrl } from './services/whatsapp';
import { Check } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { BrandMarquee } from './components/BrandMarquee';
import { Catalog } from './components/Catalog';
import { HomeSections } from './components/HomeSections';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { CookieBanner } from './components/CookieBanner';
import type { LegalTab } from './components/LegalModal';
import { loadCachedDriveProducts, mergeCatalogs } from './services/driveSync';
import {
  fetchPricesFromGoogleSheet,
  loadPricesFromCache,
  applySheetPricesToProducts,
} from './services/googleSheetsPrices';
import { initAnalytics, trackPageView } from './services/analytics';

// Code Splitting con React.lazy para vistas y modales secundarios
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const ProductDetail = React.lazy(() => import('./components/ProductDetail').then(m => ({ default: m.ProductDetail })));
const NotFound = React.lazy(() => import('./components/NotFound').then(m => ({ default: m.NotFound })));
const CartDrawer = React.lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const ProductModal = React.lazy(() => import('./components/ProductModal').then(m => ({ default: m.ProductModal })));
const LegalModal = React.lazy(() => import('./components/LegalModal').then(m => ({ default: m.LegalModal })));
const DriveSyncModal = React.lazy(() => import('./components/DriveSyncModal').then(m => ({ default: m.DriveSyncModal })));

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-10 h-10 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
    <span className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-400">Cargando...</span>
  </div>
);

export const App: React.FC = () => {
  // Catalog State (inicializa con base local + caché dinámico de Drive + precios en vivo de Google Sheets)
  const [products, setProducts] = useState<Product[]>(() => {
    let base = PRODUCTS_DATA;
    const cached = loadCachedDriveProducts();
    if (cached.length > 0) {
      const { merged } = mergeCatalogs(PRODUCTS_DATA, cached);
      base = merged;
    }
    const cachedPrices = loadPricesFromCache();
    if (cachedPrices.size > 0) {
      return applySheetPricesToProducts(base, cachedPrices);
    }
    return base;
  });
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Filters State
  const [category, setCategory] = useState<string>('all');
  const [gender, setGender] = useState<string>('all');
  const [brand, setBrand] = useState<string>('all');
  const [size, setSize] = useState<string | number>('all');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('featured');

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());
  const [wishlist, setWishlist] = useState<number[]>(() => loadWishlistFromStorage());

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [modalProductId, setModalProductId] = useState<number | null>(null);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');
  const [isDriveSyncOpen, setIsDriveSyncOpen] = useState<boolean>(false);

  // Floating Toast State for non-intrusive add-to-cart confirmation
  const [toastNotification, setToastNotification] = useState<{
    name: string;
    image: string;
    size: string;
    totalCount: number;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const handleOpenLegal = (tab: LegalTab = 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync Cart to storage
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Sync Wishlist to storage
  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  // Auto-sincronizar precios en vivo desde Google Sheets en segundo plano al cargar
  useEffect(() => {
    fetchPricesFromGoogleSheet().then((res) => {
      if (res.success && res.prices.size > 0) {
        setProducts((prev) => applySheetPricesToProducts(prev, res.prices));
      }
    });
  }, []);

  // Router handler based on URL parameters
  const handleUrlRoute = (pushHistory: boolean = false) => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');
    const catParam = params.get('cat');
    const hash = window.location.hash.replace('#', '');

    if (idParam) {
      const pid = parseInt(idParam, 10);
      if (!isNaN(pid)) {
        const found = products.find((p) => p.id === pid);
        if (found) {
          navigateTo('producto', pid, pushHistory);
          return;
        } else {
          navigateTo('not-found', undefined, pushHistory);
          return;
        }
      }
    }

    if (viewParam === 'nosotros' || hash === 'nosotros') {
      navigateTo('nosotros', undefined, pushHistory);
      return;
    }

    if (viewParam === 'terminos' || hash === 'terminos') {
      handleOpenLegal('terms');
      navigateTo('home', undefined, pushHistory);
      return;
    }

    if (viewParam === 'privacidad' || hash === 'privacidad') {
      handleOpenLegal('privacy');
      navigateTo('home', undefined, pushHistory);
      return;
    }

    if (viewParam === 'garantias' || hash === 'garantias') {
      handleOpenLegal('guarantee');
      navigateTo('home', undefined, pushHistory);
      return;
    }

    if (viewParam === 'pqr' || hash === 'pqr') {
      handleOpenLegal('pqr');
      navigateTo('home', undefined, pushHistory);
      return;
    }

    if (viewParam === '404' || viewParam === 'not-found') {
      navigateTo('not-found', undefined, pushHistory);
      return;
    }

    if (viewParam === 'hombres' || hash === 'hombres') {
      navigateTo('hombres', undefined, pushHistory);
      return;
    }

    if (viewParam === 'mujeres' || hash === 'mujeres') {
      navigateTo('mujeres', undefined, pushHistory);
      return;
    }

    if (viewParam === 'tienda' || hash === 'catalogo' || catParam) {
      navigateTo('tienda', catParam || undefined, pushHistory);
      return;
    }

    // Acceso administrativo privado para sincronización con Google Drive (ej: ?admin=sync o ?sync=drive)
    if (params.get('admin') === 'sync' || params.get('sync') === 'drive') {
      setIsDriveSyncOpen(true);
    }

    if (viewParam && viewParam !== 'home') {
      navigateTo('not-found', undefined, pushHistory);
      return;
    }

    navigateTo('home', undefined, pushHistory);
  };

  useEffect(() => {
    handleUrlRoute(false);

    const onPopState = () => {
      handleUrlRoute(false);
    };

    window.addEventListener('popstate', onPopState);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setModalProductId(null);
        setIsDriveSyncOpen(false);
      }
      // Acceso de administración privado: Ctrl + Shift + D abre/cierra panel de sincronización
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsDriveSyncOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Central reactive navigation method
  const navigateTo = (view: ViewType, param?: string | number, pushState: boolean = true) => {
    setCurrentView(view);

    if (view === 'nosotros') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'nosotros' }, '', '?view=nosotros');
    } else if (view === 'producto') {
      const pid = typeof param === 'number' ? param : parseInt(String(param), 10);
      setSelectedProductId(pid);
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'producto', id: pid }, '', `?id=${pid}`);
    } else if (view === 'hombres') {
      setCategory('all');
      setGender('Hombre');
      setBrand('all');
      setSize('all');
      setSearch('');
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'hombres' }, '', '?view=hombres');
    } else if (view === 'mujeres') {
      setCategory('all');
      setGender('Mujer');
      setBrand('all');
      setSize('all');
      setSearch('');
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'mujeres' }, '', '?view=mujeres');
    } else if (view === 'tienda') {
      setSize('all');
      setSearch('');
      if (typeof param === 'string' && param !== 'all') {
        if (param.startsWith('brand:')) {
          setCategory('all');
          setGender('all');
          setBrand(param.replace('brand:', ''));
        } else if (param.startsWith('gender:')) {
          setCategory('all');
          setGender(param.replace('gender:', ''));
          setBrand('all');
        } else if (param.startsWith('cat:')) {
          setGender('all');
          setBrand('all');
          setCategory(param.replace('cat:', ''));
        } else {
          setGender('all');
          setBrand('all');
          setCategory(param);
        }
      } else {
        setGender('all');
        setBrand('all');
        setCategory('all');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'tienda' }, '', '?view=tienda');
    } else if (view === 'not-found') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (pushState) window.history.pushState({ view: 'not-found' }, '', '?view=404');
    } else {
      // 'home'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (pushState) window.history.pushState({ view: 'home' }, '', window.location.pathname);
    }
  };

  // Current product for detail view & SEO
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const relatedProducts = products.filter(
    (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand)
  );

  // Current modal product
  const modalProduct = products.find((p) => p.id === modalProductId) || null;

  // Dynamic SEO Titles, Canonical & Meta Descriptions + Analytics Tracking
  useEffect(() => {
    let title = 'Bonanza 2020 | Ropa y Calzado Deportivo Urbano';
    let desc = 'Tienda oficial de calzado y ropa deportiva urbana en Colombia. Envíos nacionales y pago contra entrega en Valledupar. Calle 16B # 7A-55 Barrio Centro.';
    
    // Host servido base (cambiar a https://bonanza2020.com al conectar dominio oficial)
    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://almacen-bonanza-2020.vercel.app';
    let path = '/';

    if (currentView === 'tienda') {
      title = category !== 'all' ? `Línea ${category} | Bonanza 2020` : 'Catálogo Completo de Calzado y Ropa | Bonanza 2020';
      desc = `Explora ${products.length} referencias en stock de calzado y streetwear en Valledupar, Colombia.`;
      path = category !== 'all' ? `/?view=tienda&cat=${encodeURIComponent(category)}` : '/?view=tienda';
    } else if (currentView === 'hombres') {
      title = 'Calzado y Ropa para Hombre | Bonanza 2020';
      desc = 'Siluetas de calzado y conjuntos deportivos para hombre en Valledupar y despachos a toda Colombia.';
      path = '/?view=hombres';
    } else if (currentView === 'mujeres') {
      title = 'Calzado y Ropa para Mujer | Bonanza 2020';
      desc = 'Colección urbana y calzado deportivo para mujer en Valledupar y despachos nacionales.';
      path = '/?view=mujeres';
    } else if (currentView === 'nosotros') {
      title = 'Sobre Nosotros | Bonanza 2020 Valledupar';
      desc = 'Conoce nuestra tienda física en Calle 16B # 7A-55 Barrio Centro, Valledupar. Garantía de talla y compra segura.';
      path = '/?view=nosotros';
    } else if (currentView === 'producto' && currentProduct) {
      title = `${currentProduct.name} - ${currentProduct.brand} | Bonanza 2020`;
      desc = `${currentProduct.description} Disponible en stock en Bonanza 2020.`;
      path = `/?id=${currentProduct.id}`;
    } else if (currentView === 'not-found') {
      title = '404 - Referencia no disponible | Bonanza 2020';
      desc = 'La página o referencia solicitada no está disponible.';
      path = '/?view=404';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Canonical dinámico por página
    const canonicalUrl = `${siteOrigin}${path}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalTag);
    }

    // Open Graph URL dinámica
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute('content', canonicalUrl);
    }

    trackPageView(title, window.location.search || '/');
  }, [currentView, currentProduct, category, products.length]);

  // Init analytics on mount and listen to cookie consent updates
  useEffect(() => {
    initAnalytics();
    const handleConsent = () => initAnalytics();
    window.addEventListener('cookie_consent_updated', handleConsent);
    return () => window.removeEventListener('cookie_consent_updated', handleConsent);
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setCategory('all');
    setGender('all');
    setBrand('all');
    setSize('all');
    setSearch('');
    setSort('featured');
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Toggle wishlist filter
  const handleToggleWishlistFilter = () => {
    if (search === 'FAV_WISHLIST_FILTER') {
      setSearch('');
    } else {
      if (wishlist.length === 0) {
        alert('Aún no tienes favoritos guardados. Toca el corazón en cualquier calzado para guardarlo aquí.');
        return;
      }
      setSearch('FAV_WISHLIST_FILTER');
      if (currentView !== 'tienda' && currentView !== 'home') {
        navigateTo('tienda');
      }
    }
  };

  // Add to cart
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

    // Notificación informativa no invasiva (no abre el carrito de golpe)
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

  // Update cart qty
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

  // Remove from cart
  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Checkout via WhatsApp
  const handleCheckoutWhatsApp = (
    clientName: string,
    clientAddress: string,
    deliveryMethod: 'valledupar' | 'nacional',
    paymentMethod: 'contraentrega' | 'transferencia'
  ) => {
    if (cart.length === 0) return;
    const url = buildCartWhatsAppUrl(
      cart,
      clientName || 'Cliente',
      clientAddress || (deliveryMethod === 'valledupar' ? 'Valledupar' : 'Colombia'),
      deliveryMethod,
      paymentMethod
    );
    window.open(url, '_blank');
  };

  // Focus search
  const handleFocusSearch = () => {
    if (currentView !== 'home' && currentView !== 'tienda') {
      navigateTo('tienda');
    }
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    }, 200);
  };

  // Handler for brand filtering with smooth scroll
  const handleSelectBrand = (b: string) => {
    setBrand(b);
    setTimeout(() => {
      const el = document.getElementById('catalogo');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] antialiased selection:bg-[#111111] selection:text-white flex flex-col justify-between">
      
      {/* Top Fixed Reactive Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        cartCount={cart.reduce((c, item) => c + item.qty, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleWishlistFilter={handleToggleWishlistFilter}
        isWishlistActive={search === 'FAV_WISHLIST_FILTER'}
        onFocusSearch={handleFocusSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'nosotros' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <About
              onNavigateToTienda={() => navigateTo('tienda')}
              onNavigateHome={() => navigateTo('home')}
            />
          </Suspense>
        )}

        {currentView === 'producto' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <ProductDetail
              product={currentProduct}
              relatedProducts={relatedProducts}
              isWishlisted={wishlist.includes(currentProduct.id)}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onNavigateHome={() => navigateTo('home')}
              onNavigateToTienda={() => navigateTo('tienda')}
              onSelectProduct={(id: number) => navigateTo('producto', id)}
            />
          </Suspense>
        )}

        {(currentView === 'tienda' || currentView === 'hombres' || currentView === 'mujeres') && (
          <>
            <BrandMarquee
              activeBrand={brand}
              onSelectBrand={handleSelectBrand}
            />
            <Catalog
              products={products}
              category={category}
              gender={gender}
              brand={brand}
              size={size}
              search={search}
              sort={sort}
              onSetCategory={setCategory}
              onSetGender={setGender}
              onSetBrand={setBrand}
              onSetSize={setSize}
              onSetSearch={setSearch}
              onSetSort={setSort}
              onResetFilters={handleResetFilters}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenModal={(id: number) => setModalProductId(id)}
              onOpenDetail={(id: number) => navigateTo('producto', id)}
              searchInputRef={searchInputRef}
            />
          </>
        )}

        {currentView === 'home' && (
          <>
            {/* 1. Kinetic 3D Hero */}
            <Hero
              onNavigateToTienda={() => navigateTo('tienda')}
              onOpenProductModal={(id) => setModalProductId(id)}
            />

            {/* 2. Value Features */}
            <Features />

            {/* 3. Brand Marquee */}
            <BrandMarquee
              activeBrand={brand}
              onSelectBrand={handleSelectBrand}
            />

            {/* 4. Secciones Curadas del Landing + Botón a Catálogo Completo */}
            <HomeSections
              products={products}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenModal={(id: number) => setModalProductId(id)}
              onOpenDetail={(id: number) => navigateTo('producto', id)}
              onNavigateToTienda={(cat) => navigateTo('tienda', cat)}
            />
          </>
        )}

        {currentView === 'not-found' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <NotFound onNavigate={navigateTo} />
          </Suspense>
        )}
      </main>

      {/* Slide-over Shopping Bag Drawer */}
      <Suspense fallback={null}>
        <CartDrawer
          isOpen={isCartOpen}
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveFromCart}
          onCheckoutWhatsApp={handleCheckoutWhatsApp}
          onNavigateToTienda={() => {
            setIsCartOpen(false);
            navigateTo('tienda');
          }}
          onOpenLegal={handleOpenLegal}
        />
      </Suspense>

      {/* Quick View Product Modal */}
      <Suspense fallback={null}>
        <ProductModal
          isOpen={modalProductId !== null}
          product={modalProduct}
          onClose={() => setModalProductId(null)}
          onAddToCart={handleAddToCart}
          onOpenDetail={(id: number) => {
            setModalProductId(null);
            navigateTo('producto', id);
          }}
        />
      </Suspense>

      {/* Non-intrusive Add to Cart Toast Confirmation */}
      {toastNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111111]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[92vw] sm:max-w-md select-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/60">
            <img
              src={toastNotification.image}
              alt={toastNotification.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>Añadido a la bolsa</span>
              <span className="text-white font-mono text-[11px] bg-white/15 px-1.5 py-0.5 rounded-full font-bold">
                {toastNotification.totalCount}
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 truncate mt-0.5">
              {toastNotification.name} · Talla {toastNotification.size}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setToastNotification(null);
            }}
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
          >
            Ver bolsa
          </button>
        </aside>
      )}

      {/* Floating WhatsApp Assistance */}
      <WhatsAppFloat />

      {/* Editorial Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenLegal={handleOpenLegal}
        onOpenDriveSync={() => setIsDriveSyncOpen(true)}
      />

      {/* Interactive Colombian Compliance & Legal Modal */}
      <Suspense fallback={null}>
        <LegalModal
          isOpen={isLegalOpen}
          onClose={() => setIsLegalOpen(false)}
          initialTab={legalTab}
        />
      </Suspense>

      {/* Google Sheets / Drive Catalog Sync Modal */}
      <Suspense fallback={null}>
        <DriveSyncModal
          isOpen={isDriveSyncOpen}
          onClose={() => setIsDriveSyncOpen(false)}
          productsCount={products.length}
          products={products}
          onSyncSuccess={(updatedProducts) => {
            setProducts(updatedProducts);
          }}
        />
      </Suspense>

      {/* Privacy & Cookie Consent Banner */}
      <CookieBanner onOpenPrivacyPolicy={() => handleOpenLegal('privacy')} />

    </div>
  );
};
