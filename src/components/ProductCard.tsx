import React, { useState } from 'react';
import { Product } from '../types/index';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatCOP } from '../services/whatsapp';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (id: number, size: string | number) => void;
  onOpenModal: (id: number) => void;
  onOpenDetail: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenModal,
  onOpenDetail,
}) => {
  const [imageError, setImageError] = useState(false);

  // Siempre se muestra la imagen auténtica de la referencia seleccionada (sin alternar en hover)
  const displayImage = !imageError
    ? product.image
    : 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800';

  return (
    <div
      onClick={() => onOpenDetail(product.id)}
      className="product-card group relative bg-white rounded-3xl border border-neutral-200/80 p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Product Image Stage: Imagen limpia con bordes curvos sin marco doble de profundidad */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-neutral-100 group/img">
        

        {/* Top Floating Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-600 scale-110 shadow-sm'
              : 'bg-white/85 hover:bg-white text-neutral-500 hover:text-neutral-950 hover:scale-105'
          }`}
          title={isWishlisted ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Foto auténtica del producto con bordes curvos y zoom sutil en hover */}
        <img
          src={displayImage}
          alt={`${product.name} - ${product.brand} · Bonanza 2020`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Floating Quick View button on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product.id);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs text-neutral-900 hover:bg-neutral-950 hover:text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Rápida</span>
        </button>
      </div>

      {/* Product Details: Minimal & Editorial */}
      <div className="px-1 pb-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium mb-1">
          <span className="uppercase tracking-wider font-semibold text-neutral-500">{product.brand}</span>
          <span>{product.gender}</span>
        </div>

        <h3
          className="font-bold text-sm text-neutral-950 line-clamp-1 group-hover:text-neutral-600 transition-colors mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price & Clean Bag Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-baseline">
            <span className="font-extrabold text-base text-neutral-950 font-mono">
              {formatCOP(product.price)}
            </span>
          </div>

          <span
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-950 text-neutral-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Ver calzado y tallas"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
};