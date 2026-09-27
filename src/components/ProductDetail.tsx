import React, { useState, useEffect } from 'react';
import { Product } from '../types/index';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Heart, Ruler, HelpCircle, Share2, Check } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { formatCOP, buildQuickWhatsAppUrl, buildCustomSizeWhatsAppUrl } from '../services/whatsapp';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (productId: number, size: string | number) => void;
  onNavigateHome: () => void;
  onNavigateToTienda: () => void;
  onSelectProduct: (id: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  relatedProducts,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onNavigateHome,
  onNavigateToTienda,
  onSelectProduct,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | number>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 40
  );
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Reset selected size whenever product changes
  useEffect(() => {
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 40);
    setShowSizeGuide(false);
    setCopiedLink(false);
  }, [product.id]);

  const handleQuickWhatsApp = () => {
    const url = buildQuickWhatsAppUrl(product, selectedSize);
    window.open(url, '_blank');
  };

  const handleCustomOrder = () => {
    const url = buildCustomSizeWhatsAppUrl(product.name, selectedSize);
    window.open(url, '_blank');
  };

  const handleAdd = () => {
    onAddToCart(product.id, selectedSize);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bonanza 2020 - ${product.name}`,
          text: `Mira ${product.name} en Bonanza 2020`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-4">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-neutral-900 transition-colors cursor-pointer"
        >
          Inicio
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={onNavigateToTienda}
          className="hover:text-neutral-900 transition-colors cursor-pointer"
        >
          Tienda
        </button>
        <span>/</span>
        <span className="text-neutral-600">{product.brand}</span>
        <span>/</span>
        <span className="text-neutral-950 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        
        {/* Left: Imagen oficial del producto */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square sm:aspect-[4/3] w-full bg-neutral-100 rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden group">
            <img
              src={product.image}
              alt={`${product.name} - ${product.brand} - Calzado en Bonanza 2020`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 select-none"
              decoding="async"
            />
          </div>
        </div>

        {/* Right: Info & CTA (Light, sleek, airy layout) */}
        <div className="lg:col-span-5 flex flex-col items-start pt-1">
          <div className="w-full flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {product.brand} · {product.gender}
            </span>

            {/* Share product button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-neutral-100"
              title="Compartir o copiar enlace del producto"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Enlace copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950 tracking-tight leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline mb-5 pb-4 border-b border-neutral-200/80 w-full">
            <span className="font-display font-black text-2xl sm:text-3xl text-neutral-950 font-mono">
              {formatCOP(product.price)}
            </span>
          </div>

          {/* Size Selector (Light, compact pills) */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Tallas disponibles:
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-neutral-500" />
                <span>Guía de tallas</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[42px] h-9 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    selectedSize === s
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Custom size inquiry */}
            <button
              type="button"
              onClick={handleCustomOrder}
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>¿No encuentras tu talla? Te la conseguimos por encargo</span>
            </button>
          </div>

          {/* Action CTAs (Lightweight, elegant hierarchy) */}
          <div className="w-full space-y-2.5 mb-6">
            {/* Primary Action Row: Add to Cart + Wishlist */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir a la Bolsa</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:border-neutral-300'
                }`}
                title={isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Secondary Action: Direct WhatsApp Order */}
            <button
              type="button"
              onClick={handleQuickWhatsApp}
              className="w-full bg-emerald-50/90 hover:bg-emerald-100 active:scale-98 text-emerald-800 border border-emerald-200/80 font-bold py-3 px-4 rounded-2xl flex items-center justify-center text-center transition-all cursor-pointer text-xs"
            >
              <span className="inline-flex items-center justify-center gap-2 mx-auto">
                <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pedir directo por WhatsApp</span>
              </span>
            </button>
          </div>

          {/* Description & Value Props (Airy minimalist style) */}
          <div className="w-full pt-4 border-t border-neutral-200/80 space-y-3.5 text-xs text-neutral-600">
            <p className="leading-relaxed font-normal">{product.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>Envíos 2-4 días a Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Contra entrega Valledupar</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <RefreshCw className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>Garantía de satisfacción y cambio de talla</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        initialTab={product.category === 'Conjuntos' || product.category === 'Camisetas' ? 'apparel' : 'shoes'}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-neutral-200/80">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-neutral-950 mb-4">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {relatedProducts.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel.id)}
                className="bg-white rounded-2xl p-3.5 border border-neutral-200/80 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-square bg-neutral-50 rounded-xl p-2.5 mb-2.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-0.5">{rel.brand}</span>
                  <h4 className="text-xs font-bold text-neutral-900 truncate mb-1">{rel.name}</h4>
                  <span className="text-xs font-extrabold text-neutral-950 font-mono">{formatCOP(rel.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
