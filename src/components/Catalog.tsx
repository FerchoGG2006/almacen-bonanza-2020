import React, { useState } from 'react';
import { Product } from '../types/index';
import { ProductCard } from './ProductCard';
import { Search, X, RotateCcw, SlidersHorizontal, Tag } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  category: string;
  gender: string;
  brand: string;
  size: string | number;
  search: string;
  sort: string;
  onSetCategory: (cat: string) => void;
  onSetGender: (gender: string) => void;
  onSetBrand: (brand: string) => void;
  onSetSize: (size: string | number) => void;
  onSetSearch: (search: string) => void;
  onSetSort: (sort: string) => void;
  onResetFilters: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (id: number, size: string | number) => void;
  onOpenModal: (id: number) => void;
  onOpenDetail: (id: number) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  category,
  gender,
  brand,
  size,
  search,
  sort,
  onSetCategory,
  onSetGender,
  onSetBrand,
  onSetSize,
  onSetSearch,
  onSetSort,
  onResetFilters,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenModal,
  onOpenDetail,
  searchInputRef,
}) => {
  const [priceRange, setPriceRange] = useState<'all' | 'under-200' | '200-250' | 'over-250' | 'deals'>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'Zapatillas', label: 'Zapatillas' },
    { id: 'Running', label: 'Running' },
    { id: 'Conjuntos', label: 'Conjuntos' },
    { id: 'Camisetas', label: 'Camisetas' },
  ];

  const brands = ['Nike', 'Adidas', 'New Balance', 'On Cloud', 'Asics', 'Puma', 'Bonanza Sport', 'Fútbol Club'];
  const sizes: (string | number)[] = [37, 38, 39, 40, 41, 42, 43, 'S', 'M', 'L', 'XL'];

  const priceFilters: { id: 'all' | 'under-200' | '200-250' | 'over-250' | 'deals'; label: string }[] = [
    { id: 'all', label: 'Todos los Precios' },
    { id: 'under-200', label: 'Hasta $200.000' },
    { id: '200-250', label: '$200.000 - $250.000' },
    { id: 'over-250', label: 'Más de $250.000' },
    { id: 'deals', label: 'En Oferta' },
  ];

  // Filter logic
  const filteredProducts = products.filter((p) => {
    // Wishlist filter special case
    if (search === 'FAV_WISHLIST_FILTER') {
      if (!wishlist.includes(p.id)) return false;
    } else if (search) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (category !== 'all') {
      if (category.toLowerCase() === 'calzado') {
        if (p.category !== 'Zapatillas' && p.category !== 'Running') return false;
      } else if (category.toLowerCase() === 'ropa') {
        if (p.category !== 'Conjuntos' && p.category !== 'Camisetas') return false;
      } else {
        if (p.category.toLowerCase() !== category.toLowerCase()) return false;
      }
    }

    if (gender !== 'all') {
      if (p.gender !== gender && p.gender !== 'Unisex') return false;
    }

    if (brand !== 'all') {
      if (p.brand.toLowerCase() !== brand.toLowerCase()) return false;
    }

    if (size !== 'all') {
      const sStr = String(size);
      const hasSize = p.sizes.some((s) => String(s) === sStr);
      if (!hasSize) return false;
    }

    // Price range filter
    if (priceRange === 'under-200') {
      if (p.price > 200000) return false;
    } else if (priceRange === '200-250') {
      if (p.price < 200000 || p.price > 250000) return false;
    } else if (priceRange === 'over-250') {
      if (p.price <= 250000) return false;
    } else if (priceRange === 'deals') {
      if (!p.original_price) return false;
    }

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'name') return a.name.localeCompare(b.name);
    // 'featured'
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  const isAnyFilterActive =
    category !== 'all' ||
    gender !== 'all' ||
    brand !== 'all' ||
    size !== 'all' ||
    priceRange !== 'all' ||
    search !== '';

  const handleFullReset = () => {
    setPriceRange('all');
    onResetFilters();
  };

  let catalogTitle = "Catálogo Completo";
  if (search === 'FAV_WISHLIST_FILTER') {
    catalogTitle = "Mis Favoritos";
  } else if (brand !== 'all' && gender !== 'all') {
    catalogTitle = `${brand} · ${gender}`;
  } else if (brand !== 'all') {
    catalogTitle = `Colección ${brand}`;
  } else if (gender === 'Hombre') {
    catalogTitle = "Colección Masculina";
  } else if (gender === 'Mujer') {
    catalogTitle = "Colección Femenina";
  } else if (category !== 'all') {
    catalogTitle = `Línea ${category}`;
  }

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
      
      {/* Catalog Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight flex items-center gap-3">
            <span>{catalogTitle}</span>
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-200/80 px-3 py-1 rounded-full">
              Mostrando {sortedProducts.length} de {products.length} referencias
            </span>
          </h2>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search === 'FAV_WISHLIST_FILTER' ? '' : search}
            onChange={(e) => onSetSearch(e.target.value)}
            placeholder="Buscar referencia o marca..."
            className="w-full text-xs pl-10 pr-9 py-2.5 bg-white border border-neutral-200 rounded-full outline-none focus:border-neutral-950 text-neutral-900 transition-colors shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSetSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
              title="Limpiar búsqueda"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs & Filter Selects */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((c) => {
            const isActive = category.toLowerCase() === c.id.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSetCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Dropdowns: Brand, Gender, Size, Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => onSetGender(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-neutral-200 rounded-xl outline-none cursor-pointer focus:border-neutral-950 font-medium"
          >
            <option value="all">Género: Todos</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Unisex">Unisex</option>
          </select>

          {/* Brand */}
          <select
            value={brand}
            onChange={(e) => onSetBrand(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-neutral-200 rounded-xl outline-none cursor-pointer focus:border-neutral-950 font-medium"
          >
            <option value="all">Todas las Marcas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Size */}
          <select
            value={String(size)}
            onChange={(e) => onSetSize(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-neutral-200 rounded-xl outline-none cursor-pointer focus:border-neutral-950 font-medium hidden sm:block"
          >
            <option value="all">Talla: Todas</option>
            {sizes.map((s) => (
              <option key={String(s)} value={String(s)}>
                Talla {s}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => onSetSort(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-neutral-200 rounded-xl outline-none cursor-pointer focus:border-neutral-950 font-medium"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Calificados</option>
            <option value="name">Alfabético A-Z</option>
          </select>

          {/* Reset button */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleFullReset}
              className="text-xs py-2 px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Budget / Price Range Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          <span>Presupuesto:</span>
        </span>
        {priceFilters.map((pf) => {
          const isActive = priceRange === pf.id;
          return (
            <button
              key={pf.id}
              type="button"
              onClick={() => setPriceRange(pf.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-2xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
              }`}
            >
              {pf.label}
            </button>
          );
        })}
      </div>

      {/* Active Filter Chips Bar */}
      {isAnyFilterActive && (
        <div className="flex items-center gap-2 flex-wrap mb-6 pb-3 border-b border-neutral-200/80 animate-in fade-in duration-200">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mr-1">
            Filtros activos:
          </span>

          {brand !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-neutral-950 text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Marca: {brand}</span>
              <button
                type="button"
                onClick={() => onSetBrand('all')}
                className="hover:text-rose-400 transition-colors cursor-pointer"
                title="Quitar filtro de marca"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Categoría: {category}</span>
              <button
                type="button"
                onClick={() => onSetCategory('all')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="Quitar filtro de categoría"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {gender !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Género: {gender}</span>
              <button
                type="button"
                onClick={() => onSetGender('all')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="Quitar filtro de género"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {size !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Talla: {size}</span>
              <button
                type="button"
                onClick={() => onSetSize('all')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="Quitar filtro de talla"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Precio: {priceFilters.find((p) => p.id === priceRange)?.label}</span>
              <button
                type="button"
                onClick={() => setPriceRange('all')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="Quitar filtro de precio"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {search && search !== 'FAV_WISHLIST_FILTER' && (
            <span className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              <span>Búsqueda: "{search}"</span>
              <button
                type="button"
                onClick={() => onSetSearch('')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="Quitar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleFullReset}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-950 underline ml-2 cursor-pointer transition-colors"
          >
            Limpiar todos
          </button>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onOpenModal={onOpenModal}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
          <SlidersHorizontal className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-extrabold text-lg text-neutral-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Intenta cambiar los filtros seleccionados o buscar con otro término.
          </p>
          <button
            type="button"
            onClick={handleFullReset}
            className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      )}
    </section>
  );
};
