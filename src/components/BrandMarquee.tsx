import React from 'react';
import { X, Check } from 'lucide-react';

interface BrandMarqueeProps {
  activeBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({ activeBrand, onSelectBrand }) => {
  const brands = [
    { name: 'Nike', style: 'font-black tracking-tighter italic text-2xl' },
    { name: 'Adidas', style: 'font-bold tracking-widest text-lg uppercase' },
    { name: 'New Balance', style: 'font-black text-2xl tracking-tighter italic border-b-2 border-current leading-none' },
    { name: 'Puma', style: 'font-extrabold tracking-tight text-xl uppercase' },
    { name: 'On Cloud', style: 'font-light tracking-widest text-lg uppercase' },
    { name: 'Asics', style: 'font-bold tracking-tight text-lg italic uppercase' },
  ];

  return (
    <section className="border-t border-neutral-200/80 bg-neutral-100/50 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {activeBrand !== 'all' && (
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-neutral-200/80">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-900 font-semibold">
              <span>Filtrando por marca: <strong className="text-neutral-950 font-black">{activeBrand}</strong></span>
            </span>

            <button
              type="button"
              onClick={() => onSelectBrand('all')}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-white border border-neutral-200 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X className="w-3 h-3 text-neutral-400" />
              <span>Ver todas las marcas</span>
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-6">
          {brands.map((b) => {
            const isActive = activeBrand.toLowerCase() === b.name.toLowerCase();

            return (
              <button
                key={b.name}
                type="button"
                onClick={() => onSelectBrand(isActive ? 'all' : b.name)}
                className={`relative px-5 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-lg scale-105 ring-2 ring-neutral-950'
                    : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                }`}
                title={isActive ? `Quitar filtro de ${b.name}` : `Filtrar por ${b.name}`}
              >
                <span className={b.style}>{b.name === 'New Balance' ? 'NB' : b.name}</span>
                {isActive && (
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
