import { Product } from '../types/index';
import { PRODUCTS_DATA } from '../data/products';

// Claves de almacenamiento local
export const STORAGE_KEY_DRIVE_URL = 'bonanza_drive_api_url';
export const STORAGE_KEY_SYNCED_PRODUCTS = 'bonanza_synced_products_v1';
export const STORAGE_KEY_LAST_SYNC = 'bonanza_last_sync_timestamp';

// URL configurada por defecto (se puede sobreescribir desde .env o desde la interfaz)
export const DEFAULT_DRIVE_API_URL =
  (import.meta.env.VITE_DRIVE_API_URL as string) || '';

/**
 * Obtiene la URL activa del Google Apps Script
 */
export function getDriveApiUrl(): string {
  try {
    const customUrl = localStorage.getItem(STORAGE_KEY_DRIVE_URL);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  } catch {
    // LocalStorage no disponible
  }
  return DEFAULT_DRIVE_API_URL;
}

/**
 * Guarda una nueva URL de Google Apps Script en el almacenamiento local
 */
export function setDriveApiUrl(url: string): void {
  try {
    if (url.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY_DRIVE_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_DRIVE_URL);
    }
  } catch {
    // LocalStorage no disponible
  }
}

/**
 * Genera un ID numérico único y estable a partir de un string (ej. ID de Drive)
 */
export function generateNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 10000 + Math.abs(hash % 900000);
}

/**
 * Carga productos sincronizados guardados previamente en caché local
 */
export function loadCachedDriveProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNCED_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error cargando caché de productos sincronizados:', e);
  }
  return [];
}

/**
 * Guarda los productos sincronizados en caché local
 */
export function saveCachedDriveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SYNCED_PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.warn('Error guardando caché de productos sincronizados:', e);
  }
}

/**
 * Extrae el ID de archivo de Google Drive de una URL de imagen
 */
function extractDriveIdFromUrl(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Fusiona productos locales base con productos nuevos traídos de Google Drive,
 * evitando duplicados por ID de imagen o nombre idéntico.
 */
export function mergeCatalogs(baseProducts: Product[], driveProducts: Product[]): {
  merged: Product[];
  addedCount: number;
} {
  // Set de IDs de Drive ya existentes en el catálogo base
  const existingDriveIds = new Set<string>();
  const existingNames = new Set<string>();

  baseProducts.forEach((p) => {
    const driveId = extractDriveIdFromUrl(p.image);
    if (driveId) existingDriveIds.add(driveId);
    existingNames.add(p.name.trim().toLowerCase());
  });

  const newUniqueProducts: Product[] = [];

  driveProducts.forEach((dp, index) => {
    const driveId = (dp as any).drive_file_id || extractDriveIdFromUrl(dp.image);
    const normalizedName = dp.name.trim().toLowerCase();

    // Si ya existe en baseProducts por ID de foto o nombre exacto, lo omitimos
    if ((driveId && existingDriveIds.has(driveId)) || existingNames.has(normalizedName)) {
      return;
    }

    // Asegurar ID numérico válido
    const numericId = typeof dp.id === 'number'
      ? dp.id
      : generateNumericId(driveId || `${dp.name}_${index}`);

    const completeProduct: Product = {
      id: numericId,
      name: dp.name || 'Referencia Bonanza 2020',
      brand: dp.brand || 'Bonanza Sport',
      gender: dp.gender || 'Hombre',
      category: dp.category || 'Zapatillas',
      price: Number(dp.price) || 220000,
      original_price: dp.original_price ? Number(dp.original_price) : null,
      image: dp.image,
      hover_image: dp.hover_image || dp.image,
      sizes: Array.isArray(dp.sizes) && dp.sizes.length > 0 ? dp.sizes : [37, 38, 39, 40, 41, 42, 43],
      available_sizes: Array.isArray(dp.available_sizes) ? dp.available_sizes : dp.sizes,
      tag: dp.tag || 'NUEVO INGRESO',
      rating: dp.rating || 5.0,
      reviews_count: dp.reviews_count || 1,
      is_featured: Boolean(dp.is_featured),
      description: dp.description || 'Disponible en stock oficial Bonanza 2020 con entregas contraentrega en Valledupar y envíos nacionales.',
    };

    if (driveId) existingDriveIds.add(driveId);
    existingNames.add(normalizedName);
    newUniqueProducts.push(completeProduct);
  });

  // Los productos nuevos de Drive se colocan al inicio del catálogo para darles visibilidad inmediata
  return {
    merged: [...newUniqueProducts, ...baseProducts],
    addedCount: newUniqueProducts.length,
  };
}

/**
 * Consulta la API de Google Apps Script para obtener el catálogo actualizado de Drive
 */
export async function syncDriveCatalog(
  customApiUrl?: string,
  forceRefresh: boolean = false
): Promise<{
  success: boolean;
  products: Product[];
  addedCount: number;
  message: string;
}> {
  const apiUrl = customApiUrl || getDriveApiUrl();

  if (!apiUrl) {
    return {
      success: false,
      products: [],
      addedCount: 0,
      message: 'No hay URL de Google Apps Script configurada.',
    };
  }

  try {
    const fetchUrl = forceRefresh ? `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}refresh=true` : apiUrl;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Respuesta HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success && !Array.isArray(data.products)) {
      throw new Error(data.error || 'La respuesta de Google Drive no contiene productos válidos.');
    }

    const incomingProducts: Product[] = Array.isArray(data.products) ? data.products : [];
    
    // Fusionar con el catálogo base
    const { merged, addedCount } = mergeCatalogs(PRODUCTS_DATA, incomingProducts);

    // Guardar en caché local
    saveCachedDriveProducts(incomingProducts);

    return {
      success: true,
      products: merged,
      addedCount,
      message: `Sincronización exitosa: ${incomingProducts.length} productos en Drive (${addedCount} nuevos añadidos).`,
    };
  } catch (error: any) {
    console.error('Error al sincronizar catálogo con Google Drive:', error);
    return {
      success: false,
      products: [],
      addedCount: 0,
      message: error.message || 'Error de conexión con Google Drive.',
    };
  }
}
