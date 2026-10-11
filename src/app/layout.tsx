import type { Metadata, Viewport } from 'next';
import '../../style.css';
import { ShopProvider } from '../context/ShopContext';
import { ClientShell } from '../components/ClientShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://almacen-bonanza-2020.vercel.app'),
  title: {
    default: 'BONANZA 2020 | Ropa y Calzado Deportivo Urbano',
    template: '%s | Bonanza 2020',
  },
  description:
    'Tienda oficial de calzado y ropa deportiva urbana en Colombia. Envíos nacionales y pago contra entrega en Valledupar. Calle 16B # 7A-55 Barrio Centro.',
  verification: {
    google: 'GSC_VERIFICATION_TOKEN_PENDING',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Bonanza 2020',
    title: 'BONANZA 2020 | Ropa y Calzado Deportivo Urbano',
    description:
      'Sneakers premium, zapatillas urbanas y ropa deportiva con envíos a toda Colombia y contraentrega en Valledupar.',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800',
        width: 800,
        height: 800,
        alt: 'Bonanza 2020 Sneakers y Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BONANZA 2020 | Ropa y Calzado Deportivo Urbano',
    description:
      'Sneakers premium, zapatillas urbanas y ropa deportiva con envíos a toda Colombia y contraentrega en Valledupar.',
    images: ['https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w800'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#F5F5F5] text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
        <ShopProvider>
          <ClientShell>{children}</ClientShell>
        </ShopProvider>
      </body>
    </html>
  );
}
