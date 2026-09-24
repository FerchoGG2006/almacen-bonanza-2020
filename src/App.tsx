import React, { useState, useEffect, useRef } from 'react';
import { ViewType, Product, CartItem } from './types/index';
import { PRODUCTS_DATA } from './data/products';
import { loadCartFromStorage, saveCartToStorage, loadWishlistFromStorage, saveWishlistToStorage } from './services/storage';
import { buildCartWhatsAppUrl } from './services/whatsapp';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { BrandMarquee } from './components/BrandMarquee';
import { Catalog } from './components/Catalog';
import { HomeSections } from './components/HomeSections';
import { About } from './components/About';
import { ProductDetail } from './components/ProductDetail';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { LegalModal, LegalTab } from './components/LegalModal';
import { DriveSyncModal } from './components/DriveSyncModal';
import { loadCachedDriveProducts, mergeCatalogs, getDriveApiUrl, syncDriveCatalog } from './services/driveSync';

export const App: React.FC = () => {
  // Catalog State (inicializa con base local + caché dinámico de Drive)
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = loadCachedDriveProducts();
    if (cached.length > 0) {
      const { merged } = mergeCatalogs(PRODUCTS_DATA, cached);
      return merged;
    }
    return PRODUCTS_DATA;
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

  const handleOpenLegal = (tab: LegalTab = 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Auto-sincronización con Google Drive en segundo plano si existe URL configurada
  useEffect(() => {
    const driveUrl = getDriveApiUrl();
    if (driveUrl) {
      syncDriveCatalog(driveUrl)
        .then((res) => {
          if (res.success && res.products.length > 0) {
            setProducts(res.products);
          }
        })
        .catch((err) => console.warn('Drive auto-sync:', err));
    }
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync Cart to storage
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Sync Wishlist to storage
  useEffect(() => {
    saveWishlistToStorage(wishlist);
  }, [wishlist]);

  // Router handler based on URL parameters
  const handleUrlRoute = (pushHistory: boolean = false) => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as ViewType | null;
    const idParam = params.get('id');
    const catParam = params.get('cat');
    const hash = window.location.hash.replace('#', '');

    if (idParam) {
      const pid = parseInt(idParam, 10);
      if (!isNaN(pid)) {
        navigateTo('producto', pid, pushHistory);
        return;
      }
    }

    if (viewParam === 'nosotros' || hash === 'nosotros') {
      navigateTo('nosotros', undefined, pushHistory);
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
    } else {
      // 'home'
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (pushState) window.history.pushState({ view: 'home' }, '', window.location.pathname);
    }
  };

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
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === productId && item.size === chosenSize);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + 1 };
        return next;
      } else {
        return [
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
    });
    setIsCartOpen(true);
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

  // Current product for detail view
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const relatedProducts = products.filter(
    (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand)
  );

  // Current modal product
  const modalProduct = products.find((p) => p.id === modalProductId) || null;

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
          <About
            onNavigateToTienda={() => navigateTo('tienda')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'producto' && (
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
      </main>

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
          navigateTo('tienda');
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
          navigateTo('producto', id);
        }}
      />

      {/* Floating WhatsApp Assistance */}
      <WhatsAppFloat />

      {/* Editorial Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenLegal={handleOpenLegal}
        onOpenDriveSync={() => setIsDriveSyncOpen(true)}
      />

      {/* Interactive Colombian Compliance & Legal Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* Google Drive Catalog Sync Modal */}
      <DriveSyncModal
        isOpen={isDriveSyncOpen}
        onClose={() => setIsDriveSyncOpen(false)}
        productsCount={products.length}
        onSyncSuccess={(updatedProducts) => {
          setProducts(updatedProducts);
        }}
      />

    </div>
  );
};
