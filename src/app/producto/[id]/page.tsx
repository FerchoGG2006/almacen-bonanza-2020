import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS_DATA } from '../../../data/products';
import { ProductPageClient } from './ProductPageClient';

export const revalidate = 86400; // ISR diario
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Pre-renderizar las primeras 80 referencias al build, y el resto bajo demanda vía ISR
  return PRODUCTS_DATA.slice(0, 80).map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  const product = PRODUCTS_DATA.find((p) => p.id === productId);

  if (!product) {
    return {
      title: 'Producto no encontrado | Bonanza 2020',
      description: 'El producto solicitado no está disponible en el catálogo.',
    };
  }

  const title = `${product.name} - ${product.brand} | Bonanza 2020`;
  const description = `${product.description} Disponible en stock en Bonanza 2020 Valledupar. Envíos a toda Colombia.`;
  const canonical = `https://almacen-bonanza-2020.vercel.app/producto/${product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: 'Bonanza 2020',
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: `${product.name} - ${product.brand}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  const product = PRODUCTS_DATA.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 8);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image, product.hover_image].filter(Boolean),
    description: product.description,
    sku: `SKU-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.8,
      reviewCount: product.reviews_count || 15,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: `https://almacen-bonanza-2020.vercel.app/producto/${product.id}`,
      seller: {
        '@type': 'Store',
        name: 'Bonanza 2020',
      },
    },
  };

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
        name: product.category,
        item: `https://almacen-bonanza-2020.vercel.app/tienda?cat=${encodeURIComponent(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `https://almacen-bonanza-2020.vercel.app/producto/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
