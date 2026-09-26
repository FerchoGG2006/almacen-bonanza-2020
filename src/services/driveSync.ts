import { Product } from '../types/index';
import { PRODUCTS_DATA } from '../data/products';

// Claves de almacenamiento local
export const STORAGE_KEY_DRIVE_URL = 'bonanza_drive_api_url';
export const STORAGE_KEY_SYNCED_PRODUCTS = 'bonanza_synced_products_v2';
export const STORAGE_KEY_LAST_SYNC = 'bonanza_last_sync_timestamp';

// URL configurada por defecto (se puede sobreescribir desde .env o desde la interfaz)
export const DEFAULT_DRIVE_API_URL =
  ((import.meta as any).env?.VITE_DRIVE_API_URL as string) ||
  'https://script.google.com/macros/s/AKfycby4PkhnzHQnmBCU1nPumyB3jPFePsTguv5dT_aeUdb2OxhVbS-GFDfsomV598q3NUPv5Q/exec';

/**
 * Detecta si un nombre es un UUID o hash crudo de archivo
 */
export function isHashName(str: string): boolean {
  if (!str) return true;
  const s = str.trim();
  if (/^[0-9A-Fa-f]{8}[-_ ]?[0-9A-Fa-f]{4}/.test(s)) return true;
  if (/^On Cloud [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Puma [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Nike [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Adidas [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^IMG[_\s-]?\d+/i.test(s)) return true;
  if (/^[0-9A-F\s-]{16,}$/i.test(s)) return true;
  const words = s.split(/[\s-_]+/);
  if (words.some((w) => w.length >= 8 && /^[0-9A-Fa-f]+$/.test(w))) return true;
  return false;
}

/**
 * Transforma y sanea productos con nombres feos o precios de hash en productos comerciales
 */
export function sanitizeProduct(p: Product, index: number = 0): Product {
  let name = (p.name || '').trim();
  let brand = p.brand || 'Bonanza Sport';
  let price = Number(p.price) || 220000;
  const category = p.category || 'Zapatillas';
  const gender = p.gender || 'Hombre';
  let tag = p.tag || 'NUEVO INGRESO';

  const needsNewName = isHashName(name);

  if (brand === 'On Cloud') {
    const models = ['On Cloudmonster 2', 'On Cloudsurfer Running', 'On Cloudtilt LOEWE', 'On Cloud 5 Coast', 'On Cloudrunner 2', 'On Cloudstratus 3'];
    const colors = ['All White / Pure', 'Triple Black', 'Frost / Cobalt', 'Glacier Ice', 'Eclipse Black', 'Undyed Minimal'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 2) % colors.length]}'`;
    }
    price = 260000;
    tag = 'RUNNING PRO';
  } else if (brand === 'Nike') {
    const models = ["Nike Air Force 1 '07", 'Nike Dunk Low Retro', 'Air Jordan 4 Retro', 'Air Jordan 1 Mid', "Nike Air Max Plus 'Tn'", 'Nike Zoom Vomero 5', 'Nike SB Dunk Low'];
    const colors = ['Triple White', 'Panda Edition', 'Military Black', 'Photon Dust', 'Phantom Grey', 'Black Gum', 'University Blue'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 3) % colors.length]}'`;
    }
    price = 245000;
    tag = 'MÁS VENDIDO';
  } else if (brand === 'Adidas') {
    const models = ['Adidas Originals Samba OG', 'Adidas Campus 00s Skate', 'Adidas Gazelle Bold', 'Adidas Superstar Classic', 'Adidas Spezial Handball', 'Adidas Forum Low 84'];
    const colors = ['Cloud White / Black', 'Core Black Gum', 'Collegiate Green', 'Wonder White', 'Shadow Navy', 'Preloved Red'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 1) % colors.length]}'`;
    }
    price = 220000;
    tag = 'RETRO CLASSIC';
  } else if (brand === 'New Balance') {
    const models = ['New Balance 9060', 'New Balance 550 Retro', 'New Balance 1906R Protection Pack', 'New Balance 2002R Castlerock', 'New Balance 574 Core'];
    const colors = ['Sea Salt / Rain Cloud', 'Castlerock Grey', 'White Green Vintage', 'Vintage Indigo', 'Triple White'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 4) % colors.length]}'`;
    }
    price = 240000;
    tag = 'STREETWEAR';
  } else if (brand === 'Asics') {
    const models = ['Asics GEL-Kayano 14', 'Asics GEL-NYC Streetwear', 'Asics GT-2160 Runner', 'Asics GEL-1130'];
    const colors = ['Silver Cream', 'Graphite Grey', 'White Pure Silver', 'Black Pure Silver'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 1) % colors.length]}'`;
    }
    price = 230000;
    tag = 'PERFORMANCE';
  } else if (brand === 'Puma') {
    const models = ['Puma Palermo Leather', 'Puma Suede Classic XXI', 'Puma Velophasis Technisch', 'Puma Slipstream Retro'];
    const colors = ['Alpine Snow', 'Black / White', 'Vapor Grey', 'Navy / Gum'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 2) % colors.length]}'`;
    }
    price = 195000;
    tag = 'CLASSIC';
  } else if (category === 'Conjuntos') {
    const models = ['Conjunto Deportivo Microfibra Tech Pro', 'Conjunto Streetwear Training Slim', 'Conjunto Deportivo Zip-Up Essential', 'Conjunto Chándal Microfibra Air'];
    const colors = ['Navy Blue', 'Black Carbon', 'Olive Military', 'Dark Steel', 'Graphite Grey'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 2) % colors.length]}'`;
    }
    price = 140000;
    tag = 'OFERTA PACK';
  } else if (category === 'Ropa') {
    const models = ['Suéter Deportivo Microfibra Dry-Fit', 'Camiseta Graphic Streetwear Boxy Fit', 'Jogger Cargo Streetwear Elastic', 'Buzo Hoodie Oversize Heavy Cotton', 'Bermudas Deportivas Microfibra Air'];
    const colors = ['Black Carbon', 'Dark Grey Heather', 'Navy Blue', 'Olive Military', 'Off-White Classic', 'Sand Khaki'];
    if (needsNewName) {
      name = `${models[index % models.length]} '${colors[(index + 3) % colors.length]}'`;
    }
    price = index % 2 === 0 ? 85000 : 95000;
    tag = 'STREET STYLE';
  } else if (category === 'Zapatillas') {
    // Chanclas o Zapatillas Bonanza Sport
    if (index % 2 === 0) {
      const models = ['Chanclas Slide Comfort Adilette', 'Sandalias Deportivas Relax Foam', 'Chanclas Urban Street Slide'];
      const colors = ['Triple Black', 'Black / White Stripes', 'Black / Red Stripes', 'Navy / White'];
      if (needsNewName) {
        name = `${models[index % models.length]} '${colors[(index + 1) % colors.length]}'`;
      }
      price = 95000;
      tag = 'CONFORT DIARIO';
    } else {
      const models = ['Adidas Originals Samba OG', 'Adidas Campus 00s Skate', 'Adidas Superstar Classic'];
      const colors = ['Cloud White / Black', 'Core Black Gum', 'Wonder White'];
      if (needsNewName) {
        name = `${models[index % models.length]} '${colors[(index + 2) % colors.length]}'`;
      }
      price = 210000;
      brand = 'Adidas';
      tag = 'URBANO';
    }
  } else {
    if (needsNewName) {
      name = `Referencia Urban Sport Bonanza (Ref. #${index + 100})`;
    }
    if (price > 350000 || price < 50000) {
      price = 210000;
    }
  }

  // Normalizar precios que no sean múltiplos de 5.000
  if (price % 5000 !== 0) {
    price = Math.round(price / 5000) * 5000;
  }

  const isApparel = category === 'Conjuntos' || category === 'Ropa' || category === 'Camisetas';
  const cleanSizes = isApparel ? ['S', 'M', 'L', 'XL'] : [37, 38, 39, 40, 41, 42, 43];

  return {
    ...p,
    name,
    brand,
    price,
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : cleanSizes,
    available_sizes: Array.isArray(p.available_sizes) && p.available_sizes.length > 0 ? p.available_sizes : cleanSizes,
    tag,
    description: `Referencia oficial en stock Bonanza 2020 (${gender} · ${brand}). Alta calidad, materiales transpirables, pago contra entrega en Valledupar y envíos a toda Colombia.`
  };
}

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
    // Purgar caché antiguo v1 con nombres UUID
    localStorage.removeItem('bonanza_synced_products_v1');

    const raw = localStorage.getItem(STORAGE_KEY_SYNCED_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((p, idx) => sanitizeProduct(p, idx));
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
    const sanitized = products.map((p, idx) => sanitizeProduct(p, idx));
    localStorage.setItem(STORAGE_KEY_SYNCED_PRODUCTS, JSON.stringify(sanitized));
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
    const sanitized = sanitizeProduct(dp, index);
    const driveId = (sanitized as any).drive_file_id || extractDriveIdFromUrl(sanitized.image);
    const normalizedName = sanitized.name.trim().toLowerCase();

    // Si ya existe en baseProducts por ID de foto o nombre exacto, lo omitimos
    if ((driveId && existingDriveIds.has(driveId)) || existingNames.has(normalizedName)) {
      return;
    }

    // Asegurar ID numérico válido
    const numericId = typeof sanitized.id === 'number'
      ? sanitized.id
      : generateNumericId(driveId || `${sanitized.name}_${index}`);

    const completeProduct: Product = {
      ...sanitized,
      id: numericId,
    };

    if (driveId) existingDriveIds.add(driveId);
    existingNames.add(normalizedName);
    newUniqueProducts.push(completeProduct);
  });

  // Los productos base (curados de portada) van PRIMERO para mantener la máxima calidad visual
  return {
    merged: [...baseProducts, ...newUniqueProducts],
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
