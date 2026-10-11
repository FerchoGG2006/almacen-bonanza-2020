import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogPageClient } from '../../components/CatalogPageClient';

export const metadata: Metadata = {
  title: 'Catálogo Completo de Calzado y Ropa Urbana | Bonanza 2020',
  description:
    'Explora más de 1.000 referencias en stock de calzado y streetwear en Colombia. Envíos nacionales y pago contra entrega en Valledupar.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/tienda',
  },
};

export default function TiendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-400">
            Cargando catálogo...
          </span>
        </div>
      }
    >
      <CatalogPageClient />
    </Suspense>
  );
}
