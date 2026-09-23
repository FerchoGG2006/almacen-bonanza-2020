import React from 'react';
import { Product } from '../types/index';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HomeSectionsProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (id: number, size: string | number) => void;
  onOpenModal: (id: number) => void;
  onOpenDetail: (id: number) => void;
  onNavigateToTienda: (category?: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenModal,
  onOpenDetail,
  onNavigateToTienda,
}) => {
  // Sección 1: Sneakers Urbanos (Zapatillas y destacados)
  const urbanSneakers = products
    .filter((p) => p.category === 'Zapatillas' || p.is_featured)
    .slice(0, 8);

  // Sección 2: Ropa y Conjuntos Streetwear
  const apparelItems = products
    .filter((p) => p.category === 'Conjuntos' || p.category === 'Camisetas')
    .slice(0, 4);

  // Sección 3: Running & Rendimiento (On Cloud, Asics, Running)
  const performanceItems = products
    .filter((p) => p.category === 'Running' || p.brand === 'On Cloud' || p.brand === 'Asics')
    .slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-12 py-4 sm:py-6">
      
      {/* SECCIÓN 1: Calzado Urbano & Tendencias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-3 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight">
              Sneakers Urbanos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTienda('Zapatillas')}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ver todos los sneakers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {urbanSneakers.map((product) => (
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
      </section>

      {/* SECCIÓN 2: Ropa Deportiva & Sets */}
      {apparelItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-3 border-b border-neutral-200 gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight">
                Conjuntos y Ropa Deportiva
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTienda('Conjuntos')}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Ver toda la ropa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {apparelItems.map((product) => (
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
        </section>
      )}

      {/* SECCIÓN 3: Running & Amortiguación */}
      {performanceItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-3 border-b border-neutral-200 gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight">
                Running y Entrenamiento
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTienda('Running')}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Ver línea running</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {performanceItems.map((product) => (
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
        </section>
      )}

      {/* BANNER CTA: Ver Catálogo Completo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-3 leading-tight">
              Explora más de {products.length} referencias en stock
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg mx-auto">
              Filtra con precisión por marca, talla nacional exacta, presupuesto y género con envíos asegurados o contra entrega local.
            </p>

            <button
              type="button"
              onClick={() => onNavigateToTienda()}
              className="bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm inline-flex items-center gap-2.5 transition-all shadow-lg hover:scale-105 active:scale-98 cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
