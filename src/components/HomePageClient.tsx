'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '../context/ShopContext';
import { Hero } from './Hero';
import { Features } from './Features';
import { BrandMarquee } from './BrandMarquee';
import { HomeSections } from './HomeSections';

export const HomePageClient: React.FC = () => {
  const router = useRouter();
  const {
    products,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    setModalProductId,
  } = useShop();

  const handleNavigateToTienda = (cat?: string) => {
    if (cat && cat !== 'all') {
      router.push(`/tienda?cat=${encodeURIComponent(cat)}`);
    } else {
      router.push('/tienda');
    }
  };

  const handleSelectBrand = (brand: string) => {
    router.push(`/tienda?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <>
      {/* 1. Kinetic 3D Hero */}
      <Hero
        onNavigateToTienda={() => router.push('/tienda')}
        onOpenProductModal={(id) => setModalProductId(id)}
      />

      {/* 2. Value Features */}
      <Features />

      {/* 3. Brand Marquee */}
      <BrandMarquee
        activeBrand="all"
        onSelectBrand={handleSelectBrand}
      />

      {/* 4. Curated Sections */}
      <HomeSections
        products={products}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenModal={(id) => setModalProductId(id)}
        onOpenDetail={(id) => router.push(`/producto/${id}`)}
        onNavigateToTienda={handleNavigateToTienda}
      />
    </>
  );
};
