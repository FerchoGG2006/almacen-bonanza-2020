/**
 * Bonanza 2020 - Analytics & Conversion Tracking Helper
 * Respeta el consentimiento de cookies (Habeas Data / Ley 1581 de 2012)
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_ID || '';

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
 * Registra evento de conversión (ej. clic a WhatsApp, añadir al carrito)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (window.gtag && hasAnalyticsConsent() && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  }
}
