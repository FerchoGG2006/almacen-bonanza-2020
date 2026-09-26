import React from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { ViewType } from '../types/index';

interface NotFoundProps {
  onNavigate: (view: ViewType, category?: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-3xl mx-auto flex items-center justify-center text-neutral-900 mb-6 shadow-xs border border-neutral-200">
        <Compass className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-slow" />
      </div>

      <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2">
        ERROR 404
      </span>

      <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-950 tracking-tight mb-4">
        Página o referencia no disponible
      </h1>

      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed mb-8">
        La ruta o producto que estás buscando no existe, fue retirado o cambió de ubicación. Explora nuestro catálogo actualizado con más de 1.000 referencias disponibles.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-100 text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tienda')}
          className="px-7 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Explorar Catálogo Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sugerencias Rápidas */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs max-w-lg mx-auto">
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">
          Categorías Populares en Valledupar
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('tienda', 'Zapatillas')}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
          >
            Sneakers Urbanos
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tienda', 'Running')}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
          >
            Línea Running & Gym
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tienda', 'Conjuntos')}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
          >
            Conjuntos Deportivos
          </button>
        </div>
      </div>
    </section>
  );
};
