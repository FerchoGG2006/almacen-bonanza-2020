import type { Metadata } from 'next';
import { HomePageClient } from '../components/HomePageClient';

export const metadata: Metadata = {
  title: 'Bonanza 2020 | Ropa y Calzado Deportivo Urbano en Colombia',
  description:
    'Tienda oficial de calzado y ropa deportiva urbana en Colombia. Envíos nacionales y pago contra entrega en Valledupar. Calle 16B # 7A-55 Barrio Centro.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
