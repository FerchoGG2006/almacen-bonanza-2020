import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../types/index';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { formatCOP } from '../services/whatsapp';
import { getOptimizedImageUrl } from '../services/images';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (id: number, size: string | number) => void;
  onOpenModal: (id: number) => void;
  onOpenDetail?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenModal,
  onOpenDetail,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  // Siempre se muestra la imagen auténtica de la referencia seleccionada (optimizada a 400px para carga móvil ultrarrápida)
  const displayImage = !imageError
    ? getOptimizedImageUrl(product.image, 400)
    : 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w400';

  return (
    <Link
      href={`/producto/${product.id}`}
      className="product-card group relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-2.5 sm:p-3.5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Product Image Stage: Imagen limpia con bordes curvos sin marco doble de profundidad */}
      <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 bg-neutral-100 group/img">
        
        {/* Top Tag Badge */}
        {product.tag && (
          <span
            className={`absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs ${
              product.tag === 'AGOTADO'
                ? 'bg-neutral-900/90 text-white'
                : product.tag.includes('OFERTA') || (product.original_price && product.original_price > product.price)
                ? 'bg-rose-600 text-white'
                : 'bg-white/95 text-neutral-900 border border-neutral-200/80'
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Top Floating Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 p-1.5 sm:p-2 rounded-full transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-600 scale-110 shadow-sm'
              : 'bg-white/85 hover:bg-white text-neutral-500 hover:text-neutral-950 hover:scale-105'
          }`}
          title={isWishlisted ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Foto auténtica del producto con bordes curvos y zoom sutil en hover */}
        <img
          src={displayImage}
          alt={`${product.name} - ${product.brand} · Bonanza 2020`}
          width={400}
          height={400}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Floating Quick View button on hover (Desktop/Tablet) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenModal(product.id);
          }}
          className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs text-neutral-900 hover:bg-neutral-950 hover:text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Rápida</span>
        </button>
      </div>

      {/* Product Details: Minimal & Editorial */}
      <div className="px-0.5 sm:px-1 pb-0.5 sm:pb-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 font-medium mb-0.5 sm:mb-1">
          <span className="uppercase tracking-wider font-semibold text-neutral-500 truncate max-w-[65%]">{product.brand}</span>
          <span className="truncate">{product.gender}</span>
        </div>

        <h3
          className="font-bold text-xs sm:text-sm text-neutral-950 line-clamp-1 group-hover:text-neutral-600 transition-colors mb-1.5 sm:mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price & Clean Bag Indicator */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-neutral-100 gap-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-extrabold text-xs sm:text-base text-neutral-950 font-mono truncate">
              {formatCOP(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-mono truncate">
                {formatCOP(product.original_price)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={product.tag === 'AGOTADO'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.tag === 'AGOTADO') return;
              const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '40';
              onAddToCart(product.id, defaultSize);
              setIsJustAdded(true);
              setTimeout(() => setIsJustAdded(false), 1200);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90 ${
              product.tag === 'AGOTADO'
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                : isJustAdded
                ? 'bg-emerald-600 text-white scale-110 shadow-sm'
                : 'bg-neutral-100 hover:bg-neutral-950 text-neutral-700 hover:text-white hover:scale-105'
            }`}
            title={product.tag === 'AGOTADO' ? 'Producto agotado' : 'Añadir a la bolsa de compras'}
            aria-label={product.tag === 'AGOTADO' ? `${product.name} agotado` : `Añadir ${product.name} a la bolsa`}
          >
            {product.tag === 'AGOTADO' ? (
              <span className="text-[9px] font-bold">✕</span>
            ) : isJustAdded ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        </div>
      </div>

    </Link>
  );
};