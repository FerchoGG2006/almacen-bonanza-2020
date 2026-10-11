import type { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Tienda Física en Valledupar | Bonanza 2020',
  description:
    'Conoce la tienda física de Bonanza 2020 en Calle 16B # 7A-55 Barrio Centro, Valledupar, Cesar. Envíos nacionales, garantía de talla y compra 100% segura.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros y Tienda Física en Valledupar | Bonanza 2020',
    description:
      'Conoce la tienda física de Bonanza 2020 en Calle 16B # 7A-55 Barrio Centro, Valledupar. Envíos a toda Colombia y pago contra entrega.',
    url: 'https://almacen-bonanza-2020.vercel.app/nosotros',
    type: 'website',
    siteName: 'Bonanza 2020',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800',
        width: 800,
        height: 800,
        alt: 'Tienda Física Bonanza 2020 Valledupar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nosotros y Tienda Física en Valledupar | Bonanza 2020',
    description:
      'Conoce la tienda física de Bonanza 2020 en Valledupar. Envíos nacionales y pago contra entrega.',
    images: ['https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800'],
  },
};

export default function NosotrosPage() {
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
        name: 'Sobre Nosotros',
        item: 'https://almacen-bonanza-2020.vercel.app/nosotros',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutClient />
    </>
  );
}
