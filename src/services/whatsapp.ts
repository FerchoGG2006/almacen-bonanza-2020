import { CartItem, Product } from '../types/index';

export const STORE_PHONE = "573167675967";
export const STORE_PHONE_DISPLAY = "+57 316 7675967";
export const STORE_ADDRESS = "Calle 16B # 7A-55 Barrio Centro";
export const STORE_CITY = "Valledupar, Cesar, Colombia";
export const STORE_FULL_LOCATION = "Calle 16B # 7A-55 Barrio Centro, Valledupar, Colombia";
export const STORE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Calle 16B # 7A-55 Barrio Centro, Valledupar, Cesar")}`;

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

export function buildQuickWhatsAppUrl(product: Product, size: string | number): string {
  const lines = [
    "Hola Bonanza 2020.",
    "",
    "Deseo solicitar disponibilidad y coordinar la compra de la siguiente referencia:",
    `*Producto:* ${product.name}`,
    `*Talla:* ${size}`,
    `*Precio:* ${formatCOP(product.price)}`,
    `*Categoria:* ${product.category} (${product.gender})`,
    "",
    "¿Tienen disponibilidad para entrega en Valledupar o despacho nacional?"
  ];
  return `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildCustomSizeWhatsAppUrl(productName: string, sizeRequested?: string | number): string {
  const lines = [
    "Hola Bonanza 2020.",
    "",
    `Estoy interesado en la referencia: *${productName}*.`,
    sizeRequested ? `Quisiera consultar si es posible conseguirlo bajo encargo en talla: *${sizeRequested}*.` : "Quisiera consultar disponibilidad de tallas especiales o pedido bajo encargo.",
    "",
    "¿Me podrian brindar informacion sobre tiempos de llegada y confirmacion de pedido?"
  ];
  return `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildCartWhatsAppUrl(
  cart: CartItem[],
  clientName: string,
  clientAddress: string,
  deliveryMethod?: 'valledupar' | 'nacional',
  paymentMethod?: 'contraentrega' | 'transferencia'
): string {
  const name = clientName.trim() || 'Cliente';
  const address = clientAddress.trim() || 'Valledupar';
  const deliveryLabel = deliveryMethod === 'valledupar'
    ? 'Domicilio en Valledupar (Entrega Inmediata)'
    : 'Envio Nacional Asegurado (Servientrega / Interrapidisimo)';
  const paymentLabel = paymentMethod === 'contraentrega'
    ? 'Pago Contra Entrega (Efectivo al recibir)'
    : 'Transferencia Electronica (Nequi / Daviplata / Bancolombia)';

  let total = 0;
  const itemsText = cart.map((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `${index + 1}. *${item.name}*\n   - Talla: ${item.size}\n   - Cantidad: ${item.qty}\n   - Subtotal: ${formatCOP(subtotal)}`;
  }).join("\n\n");

  const lines = [
    "Hola Bonanza 2020.",
    "",
    "*PEDIDO FORMALIZADO:*",
    `*Cliente:* ${name}`,
    `*Direccion / Destino:* ${address}`,
    `*Metodo de Entrega:* ${deliveryLabel}`,
    `*Preferencia de Pago:* ${paymentLabel}`,
    "",
    "*RESUMEN DE PRODUCTOS:*",
    itemsText,
    "",
    `*TOTAL A PAGAR:* ${formatCOP(total)}`,
    "",
    "¿Me confirman disponibilidad para coordinar el despacho?"
  ];

  return `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

