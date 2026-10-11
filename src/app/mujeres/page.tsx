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
  openGraph: {
    title: 'Calzado y Ropa para Mujer | Bonanza 2020',
    description:
      'Colección urbana y calzado deportivo para mujer en Valledupar y despachos nacionales. Variedad en tallas y las mejores marcas.',
    url: 'https://almacen-bonanza-2020.vercel.app/mujeres',
    type: 'website',
    siteName: 'Bonanza 2020',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800',
        width: 800,
        height: 800,
        alt: 'Colección Mujer Bonanza 2020',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calzado y Ropa para Mujer | Bonanza 2020',
    description:
      'Colección urbana y calzado deportivo para mujer en Valledupar y despachos nacionales.',
    images: ['https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800'],
  },
};

export default function MujeresPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://almacen-bonanza-2020.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tienda',
        item: 'https://almacen-bonanza-2020.vercel.app/tienda',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Línea Mujer',
        item: 'https://almacen-bonanza-2020.vercel.app/mujeres',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
    </>
  );
}
