import React, { useState, useEffect } from 'react';
import { Product } from '../types/index';
import { X, ShoppingBag, ArrowRight, Ruler, HelpCircle } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { formatCOP, buildQuickWhatsAppUrl, buildCustomSizeWhatsAppUrl } from '../services/whatsapp';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (id: number, size: string | number) => void;
  onOpenDetail: (id: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onOpenDetail,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | number>('40');
  const [imageError, setImageError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    setImageError(false);
    setShowSizeGuide(false);
  }, [product]);

  if (!isOpen || !product) return null;

  const displayImage = !imageError 
    ? product.image 
    : 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800';

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
    onClose();
  };

  const handleFullView = () => {
    onOpenDetail(product.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Product Image Stage: Clean presentation without badges */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 group">
              <img
                src={displayImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Details */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                {product.brand} · {product.gender}
              </span>
              <h2 className="font-display font-extrabold text-xl text-neutral-950 mb-3 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline mb-4">
                <span className="font-black text-2xl text-neutral-950 font-mono">
                  {formatCOP(product.price)}
                </span>
              </div>

              {/* Sizes */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Tallas disponibles:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3 h-3 text-neutral-500" />
                    <span>Guía de tallas</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-neutral-950 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3 text-neutral-400" />
                  <span>¿No ves tu talla? Pedir por encargo</span>
                </button>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleQuickWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Pedir por WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir a la Bolsa</span>
                </button>

                <button
                  type="button"
                  onClick={handleFullView}
                  className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 py-1 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver ficha completa y más fotos</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Size Guide */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        initialTab={product.category === 'Conjuntos' || product.category === 'Camisetas' ? 'apparel' : 'shoes'}
      />
    </>
  );
};

