import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogPageClient } from '../../components/CatalogPageClient';

export const metadata: Metadata = {
  title: 'Calzado y Ropa para Hombre | Bonanza 2020',
  description:
    'Siluetas de calzado y conjuntos deportivos para hombre en Valledupar y despachos a toda Colombia. Garantía de talla y pago seguro.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/hombres',
  },
};

export default function HombresPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-400">
            Cargando colección hombres...
          </span>
        </div>
      }
    >
      <CatalogPageClient initialGender="Hombre" />
    </Suspense>
  );
}
