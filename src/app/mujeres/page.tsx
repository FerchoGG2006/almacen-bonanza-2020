import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogPageClient } from '../../components/CatalogPageClient';

export const metadata: Metadata = {
  title: 'Calzado y Ropa para Mujer | Bonanza 2020',
  description:
    'Colección urbana y calzado deportivo para mujer en Valledupar y despachos nacionales. Variedad en tallas y las mejores marcas.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/mujeres',
  },
};

export default function MujeresPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-400">
            Cargando colección mujeres...
          </span>
        </div>
      }
    >
      <CatalogPageClient initialGender="Mujer" />
    </Suspense>
  );
}
