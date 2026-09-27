import React, { useState } from 'react';
import { HeroDrop } from '../types/index';
import { ArrowRight } from 'lucide-react';
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
    image: "https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800"
  },
  {
    id: 2,
    name: "Nike Dunk Low 'Panda' Edition",
    brand: "Nike",
    price: 185000,
    spec1: "Piel sintética premium bicolor, corte bajo y tracción urbana",
    sizes: [40, 41, 42, 43, 44, 45],
    image: "https://lh3.googleusercontent.com/d/1FNPxysGWORXe5tQgNpWSDb8hifbICziq=w800"
  },
  {
    id: 3,
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 220000,
    spec1: "Silueta high legendaria, amortiguación Air-Sole y soporte de tobillo",
    sizes: [40, 41, 42, 43, 44, 45],
    image: "https://lh3.googleusercontent.com/d/15HQ-Zam7ME3yRxPCuyX0CezBv5y6xD3t=w800"
  }
];

interface HeroProps {
  onNavigateToTienda: () => void;
  onOpenProductModal: (id: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToTienda, onOpenProductModal }) => {
  const [currentDropIndex, setCurrentDropIndex] = useState(0);

  const drop = HERO_DROPS[currentDropIndex];

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
          <div className="relative rounded-3xl bg-gradient-to-b from-neutral-200/40 via-neutral-100/70 to-white border border-neutral-200/90 shadow-lg p-4 sm:p-5 flex flex-col justify-between group">
            
            {/* Top Drop Header */}
            <div className="flex items-center justify-between z-10 shrink-0 mb-1">
              <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                {drop.brand} · Colección Principal
              </span>
              <span className="text-[10px] font-bold tracking-wider text-neutral-700 bg-white/90 border border-neutral-200/80 px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                Drop Destacado
              </span>
            </div>

            {/* Foto de producto estilizada con altura equilibrada y bordes redondeados */}
            <div
              className="relative w-full h-48 sm:h-52 md:h-56 my-2 rounded-2xl overflow-hidden shadow-xs bg-neutral-100 cursor-pointer group/heroimg"
              onClick={() => onOpenProductModal(drop.id)}
            >
              <img
                src={drop.image}
                alt={`${drop.name} - Calzado urbano en Bonanza 2020`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover/heroimg:scale-105 select-none"
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
