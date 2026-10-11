import type { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Tienda Física en Valledupar | Bonanza 2020',
  description:
    'Conoce la tienda física de Bonanza 2020 en Calle 16B # 7A-55 Barrio Centro, Valledupar, Cesar. Envíos nacionales, garantía de talla y compra 100% segura.',
  alternates: {
    canonical: 'https://almacen-bonanza-2020.vercel.app/nosotros',
  },
};

export default function NosotrosPage() {
  return <AboutClient />;
}
