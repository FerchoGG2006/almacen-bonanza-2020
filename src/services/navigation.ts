import { ViewType } from '../types/index';

/**
 * Traduce vistas de la tienda a rutas URL limpias canónicas
 */
export function getViewUrl(view: ViewType, param?: string | number): string {
  if (view === 'home') return '/';
  if (view === 'hombres') return '/hombres';
  if (view === 'mujeres') return '/mujeres';
  if (view === 'nosotros') return '/nosotros';
  if (view === 'producto' && param) return `/producto/${param}`;
  if (view === 'tienda') {
    if (param && param !== 'all') {
      const p = String(param);
      if (p.startsWith('cat:')) {
        return `/tienda?cat=${encodeURIComponent(p.replace('cat:', ''))}`;
      }
      if (p.startsWith('brand:')) {
        return `/tienda?brand=${encodeURIComponent(p.replace('brand:', ''))}`;
      }
      if (p.startsWith('gender:')) {
        return `/tienda?gender=${encodeURIComponent(p.replace('gender:', ''))}`;
      }
      return `/tienda?cat=${encodeURIComponent(p)}`;
    }
    return '/tienda';
  }
  return '/';
}
