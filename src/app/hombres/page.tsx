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
  openGraph: {
    title: 'Calzado y Ropa para Hombre | Bonanza 2020',
    description:
      'Siluetas de calzado y conjuntos deportivos para hombre en Valledupar y despachos a toda Colombia.',
    url: 'https://almacen-bonanza-2020.vercel.app/hombres',
    type: 'website',
    siteName: 'Bonanza 2020',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800',
        width: 800,
        height: 800,
        alt: 'Colección Hombre Bonanza 2020',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calzado y Ropa para Hombre | Bonanza 2020',
    description:
      'Siluetas de calzado y conjuntos deportivos para hombre en Valledupar y despachos a toda Colombia.',
    images: ['https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800'],
  },
};

export default function HombresPage() {
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
        name: 'Línea Hombre',
        item: 'https://almacen-bonanza-2020.vercel.app/hombres',
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
              Cargando colección hombres...
            </span>
          </div>
        }
      >
        <CatalogPageClient initialGender="Hombre" />
      </Suspense>
    </>
  );
}
