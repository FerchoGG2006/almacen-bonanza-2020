import React, { useState } from 'react';
import { HeroDrop } from '../types/index';
import { ArrowRight, RotateCw } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { formatCOP, STORE_PHONE } from '../services/whatsapp';

const HERO_DROPS: HeroDrop[] = [
  {
    id: 1,
    name: "Air Jordan 4 Retro 'Military Black'",
    brand: "Nike",
    price: 245000,
    spec1: "Horma original, detalles de malla transpirable, suela Air Cushion",
    sizes: [40, 41, 42, 43, 44, 45],
    image: "https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800",
    hover_image: "https://lh3.googleusercontent.com/d/1HxD4ETmnqZY0uOiw63f7U9WYhuFzQo6V=w800"
  },
  {
    id: 2,
    name: "Nike Dunk Low 'Panda' Edition",
    brand: "Nike",
    price: 185000,
    spec1: "Piel sintética premium bicolor, corte bajo y tracción urbana",
    sizes: [40, 41, 42, 43, 44, 45],
    image: "https://lh3.googleusercontent.com/d/1FNPxysGWORXe5tQgNpWSDb8hifbICziq=w800",
    hover_image: "https://lh3.googleusercontent.com/d/1gshfY8RwkO7mtcB6XgxgxNkVHIZL15jp=w800"
  },
  {
    id: 3,
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 220000,
    spec1: "Silueta high legendaria, amortiguación Air-Sole y soporte de tobillo",
    sizes: [40, 41, 42, 43, 44, 45],
    image: "https://lh3.googleusercontent.com/d/15HQ-Zam7ME3yRxPCuyX0CezBv5y6xD3t=w800",
    hover_image: "https://lh3.googleusercontent.com/d/1zmhs6pzWVMM4J-8hl59FvuRa7DT6QZg0=w800"
  }
];

interface HeroProps {
  onNavigateToTienda: () => void;
  onOpenProductModal: (id: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToTienda, onOpenProductModal }) => {
  const [currentDropIndex, setCurrentDropIndex] = useState(0);
  const [isAltAngle, setIsAltAngle] = useState(false);

  const drop = HERO_DROPS[currentDropIndex];
  const currentImg = isAltAngle ? drop.hover_image : drop.image;

  const handleOrderWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Bonanza 2020. Deseo consultar disponibilidad para ordenar el calzado: *${drop.name}* (${formatCOP(drop.price)}). ¿Tienen disponibilidad inmediata para entrega en Valledupar o envio nacional?`
    );
    window.open(`https://wa.me/${STORE_PHONE}?text=${text}`, '_blank');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-3 pb-6 sm:pt-4 sm:pb-8 lg:pt-6 lg:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Typography & Action */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-950 tracking-tight leading-[1.06] mb-3.5">
            Tu estilo<br />en movimiento
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed max-w-md mb-6">
            Las mejores marcas, siluetas icónicas y calzado de alto rendimiento.<br className="hidden sm:inline" />
            Envíos a todo el país y pagos contra entrega en Valledupar.
          </p>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onNavigateToTienda}
              className="w-full sm:w-auto bg-[#111111] hover:bg-neutral-800 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wide uppercase px-7 py-3.5 rounded-full transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <span>Explorar Tienda</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenProductModal(drop.id)}
              className="w-full sm:w-auto bg-white hover:bg-neutral-100 active:scale-95 border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-semibold px-5 py-3.5 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ver Ficha Drop</span>
            </button>
          </div>
        </div>

        {/* Right Column: Kinetic 3D Interactive Shoe Stage */}
        <div className="lg:col-span-6 relative flex flex-col">
          <div className="relative rounded-3xl bg-gradient-to-b from-neutral-200/40 via-neutral-100/70 to-white border border-neutral-200/90 shadow-xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[400px] sm:min-h-[440px] group">
            
            {/* Top Drop Header */}
            <div className="flex items-center justify-between z-10 shrink-0">
              <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                {drop.brand} · Colección Principal
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAltAngle(!isAltAngle)}
                  className="bg-white/90 hover:bg-white text-neutral-800 text-[11px] px-3 py-1 rounded-full border border-neutral-200 shadow-2xs flex items-center gap-1.5 font-semibold transition-all cursor-pointer"
                  title="Girar ángulo del calzado"
                >
                  <RotateCw className={`w-3 h-3 transition-transform duration-300 ${isAltAngle ? 'rotate-180' : ''}`} />
                  <span>{isAltAngle ? 'Vista Frontal' : 'Girar Ángulo'}</span>
                </button>
              </div>
            </div>

            {/* Kinetic Shoe Stage with floating effect */}
            <div className="relative flex-1 flex items-center justify-center py-2 my-2 min-h-[160px] sm:min-h-[190px]">
              <div className="absolute inset-0 bg-radial from-neutral-400/15 to-transparent blur-xl rounded-full transform scale-90 pointer-events-none"></div>
              
              <img
                src={currentImg}
                alt={`${drop.name} - Calzado urbano en Bonanza 2020`}
                referrerPolicy="no-referrer"
                className="w-auto h-36 sm:h-44 md:h-48 max-h-[210px] object-contain drop-shadow-xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2 cursor-pointer select-none"
                onClick={() => onOpenProductModal(drop.id)}
                decoding="async"
              />
            </div>

            {/* Bottom Floating Card - Fully visible and never cut off */}
            <div className="z-10 shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-neutral-200 shadow-md flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block truncate">
                  {drop.brand}
                </span>
                <h3 className="font-display font-extrabold text-sm sm:text-base text-neutral-900 leading-tight truncate">
                  {drop.name}
                </h3>
                <span className="text-xs sm:text-sm font-black text-neutral-950 font-mono">
                  {formatCOP(drop.price)}
                </span>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                  <span>Pedir WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

          {/* Drop Selector Dots / Tabs Below Stage */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {HERO_DROPS.map((d, index) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setCurrentDropIndex(index);
                  setIsAltAngle(false);
                }}
                className={`text-[11px] font-bold py-1 px-3 rounded-full transition-all cursor-pointer ${
                  currentDropIndex === index
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                Drop 0{index + 1}: {d.name.split(' ')[0]} {d.name.split(' ')[1]}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
