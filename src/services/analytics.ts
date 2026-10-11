/**
 * Bonanza 2020 - Analytics & Conversion Tracking Helper
 * Respeta el consentimiento de cookies (Habeas Data / Ley 1581 de 2012)
 */

import { Product, CartItem } from '../types/index';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  (typeof process !== 'undefined' && process.env ? (process.env.NEXT_PUBLIC_GA_ID as string) : '') ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env ? ((import.meta as any).env.VITE_GA_ID as string) : '') ||
  '';

/**
 * Comprueba si el usuario aceptó cookies analíticas
 */
export function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('bonanza_cookie_consent');
    if (raw) {
      const consent = JSON.parse(raw);
      return Boolean(consent.analytics);
    }
  } catch {}
  return false;
}

/**
 * Inicializa Google Analytics si hay consentimiento y ID configurado
 */
export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

  if (!document.getElementById('google-analytics-script')) {
    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }
}

/**
 * Registra vista de página
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  if (window.gtag && hasAnalyticsConsent() && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath,
    });
  }
}

/**
 * Registra evento de conversión genérico
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (window.gtag && hasAnalyticsConsent() && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  }
}

/**
 * GA4 Ecommerce: view_item (Ficha de producto)
 */
export function trackViewItem(product: Product): void {
  trackEvent('view_item', {
    currency: 'COP',
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
}

/**
 * GA4 Ecommerce: add_to_cart (Añadir a la bolsa)
 */
export function trackAddToCart(product: Product, size: string | number, quantity: number = 1): void {
  trackEvent('add_to_cart', {
    currency: 'COP',
    value: product.price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        item_variant: String(size),
        price: product.price,
        quantity,
      },
    ],
  });
}

/**
 * GA4 Ecommerce: begin_checkout (Inicio de pedido / WhatsApp checkout)
 */
export function trackBeginCheckout(items: CartItem[], total: number): void {
  trackEvent('begin_checkout', {
    currency: 'COP',
    value: total,
    items: items.map((i) => ({
      item_id: String(i.id),
      item_name: i.name,
      item_brand: i.brand,
      item_variant: i.size,
      price: i.price,
      quantity: i.qty,
    })),
  });
}

/**
 * Conversión clave: Clic directo a WhatsApp
 */
export function trackWhatsAppConversion(
  source: 'direct_nav' | 'quick_buy' | 'custom_order' | 'checkout' | 'pqr',
  details?: Record<string, any>
): void {
  trackEvent('contact_whatsapp', {
    source,
    ...details,
  });
}
