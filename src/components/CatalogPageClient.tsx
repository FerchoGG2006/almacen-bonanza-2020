'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop } from '../context/ShopContext';
import { Catalog } from './Catalog';
import { BrandMarquee } from './BrandMarquee';

interface CatalogPageClientProps {
  initialGender?: string;
  initialCategory?: string;
  initialBrand?: string;
}

export const CatalogPageClient: React.FC<CatalogPageClientProps> = ({
  initialGender = 'all',
  initialCategory = 'all',
  initialBrand = 'all',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    products,
    wishlist,
    handleToggleWishlist,
    handleAddToCart,
    setModalProductId,
  } = useShop();

  const queryCat = searchParams.get('cat') || initialCategory;
  const queryGender = searchParams.get('gender') || initialGender;
  const queryBrand = searchParams.get('brand') || initialBrand;
  const querySearch = searchParams.get('q') || (searchParams.get('filter') === 'wishlist' ? 'FAV_WISHLIST_FILTER' : '');

  const [category, setCategory] = useState<string>(queryCat);
  const [gender, setGender] = useState<string>(queryGender);
  const [brand, setBrand] = useState<string>(queryBrand);
  const [size, setSize] = useState<string | number>('all');
  const [search, setSearch] = useState<string>(querySearch);
  const [sort, setSort] = useState<string>('featured');

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchParams.get('cat')) setCategory(searchParams.get('cat')!);
    if (searchParams.get('gender')) setGender(searchParams.get('gender')!);
    if (searchParams.get('brand')) setBrand(searchParams.get('brand')!);
    if (searchParams.get('q')) setSearch(searchParams.get('q')!);
    if (searchParams.get('filter') === 'wishlist') setSearch('FAV_WISHLIST_FILTER');

    if (searchParams.get('focus') === 'search') {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }, 150);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setCategory('all');
    setGender('all');
    setBrand('all');
    setSize('all');
    setSearch('');
    setSort('featured');
  };

  return (
    <>
      <BrandMarquee
        activeBrand={brand}
        onSelectBrand={(b) => setBrand(b)}
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
        onOpenModal={(id) => setModalProductId(id)}
        onOpenDetail={(id) => router.push(`/producto/${id}`)}
        searchInputRef={searchInputRef}
      />
    </>
  );
};
