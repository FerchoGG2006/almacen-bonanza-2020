import { Product } from '../types/index';

export interface SheetPriceEntry {
  id: number;
  price: number;
  original_price: number | null;
  is_available: boolean;
  name?: string;
}

export const STORAGE_KEY_SHEET_ID = 'bonanza_sheets_price_id';
export const STORAGE_KEY_SHEET_TAB = 'bonanza_sheets_price_tab';
export const STORAGE_KEY_PRICES_CACHE = 'bonanza_sheet_prices_cache_v1';
export const STORAGE_KEY_PRICES_LAST_SYNC = 'bonanza_sheet_prices_last_sync';

// ID de la hoja de cálculo de Google por defecto (Resumen Bonanza Compartido)
export const DEFAULT_SHEET_ID =
  ((import.meta as any).env?.VITE_SHEETS_PRICE_ID as string) ||
  '16bNKtZkxBzyUaRHjcVJQGhC8tWsorXTJHzUN648idVk';

export const DEFAULT_SHEET_TAB = 'LISTA_PRECIOS';

/**
 * Obtiene el ID del Google Sheet configurado
 */
export function getSheetId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_ID) || DEFAULT_SHEET_ID;
  } catch {
    return DEFAULT_SHEET_ID;
  }
}

/**
 * Guarda el ID del Google Sheet
 */
export function setSheetId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_ID, id.trim());
  } catch {
    // Silently ignore storage issues
  }
}

/**
 * Obtiene el nombre de la pestaña de precios
 */
export function getSheetTab(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_TAB) || DEFAULT_SHEET_TAB;
  } catch {
    return DEFAULT_SHEET_TAB;
  }
}

/**
 * Guarda el nombre de la pestaña de precios
 */
export function setSheetTab(tab: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_TAB, tab.trim());
  } catch {
    // Silently ignore storage issues
  }
}

/**
 * Parsea una línea de CSV respetando comillas
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Limpia y convierte texto de precio (ej. "$ 245.000" o "245000") a número entero
 */
function parsePrice(val: string | undefined): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9]/g, '');
  if (!cleaned) return null;
  const num = parseInt(cleaned, 10);
  return isNaN(num) || num <= 0 ? null : num;
}

/**
 * Consulta y descarga los precios en vivo desde Google Sheets en formato CSV
 */
export async function fetchPricesFromGoogleSheet(
  sheetId: string = getSheetId(),
  tabName: string = getSheetTab()
): Promise<{ success: boolean; prices: Map<number, SheetPriceEntry>; error?: string }> {
  try {
    // Endpoint oficial de exportación de Google Sheets en formato CSV
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
      tabName
    )}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: no se pudo acceder al Google Sheet`);
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      return {
        success: false,
        prices: new Map(),
        error: `La pestaña "${tabName}" no contiene filas de datos o está vacía.`,
      };
    }

    const header = parseCsvLine(lines[0]).map((h) =>
      h.toUpperCase().replace(/[^A-Z0-9_]/g, '')
    );

    const idIndex = header.findIndex((h) => h === 'ID' || h.startsWith('ID'));
    const priceIndex = header.findIndex(
      (h) => h.includes('PRECIO_VENTA') || h === 'PRECIO' || h.includes('VENTA')
    );
    const offerIndex = header.findIndex(
      (h) => h.includes('PRECIO_OFERTA') || h.includes('OFERTA') || h.includes('DESCUENTO')
    );
    const statusIndex = header.findIndex(
      (h) => h.includes('ESTADO') || h.includes('DISPONIBILIDAD') || h.includes('STOCK')
    );
    const nameIndex = header.findIndex(
      (h) => h.includes('REFERENCIA') || h.includes('NOMBRE') || h.includes('PRODUCTO')
    );

    if (idIndex === -1 || priceIndex === -1) {
      return {
        success: false,
        prices: new Map(),
        error: `Las columnas 'ID' y 'PRECIO_VENTA_COP' no fueron encontradas en la cabecera del Google Sheet.`,
      };
    }

    const pricesMap = new Map<number, SheetPriceEntry>();

    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i]);
      const rawId = row[idIndex]?.replace(/[^0-9]/g, '');
      const id = rawId ? parseInt(rawId, 10) : NaN;
      if (isNaN(id) || id <= 0) continue;

      const rawPrice = row[priceIndex];
      const parsedPrice = parsePrice(rawPrice);
      if (!parsedPrice) continue;

      const rawOffer = offerIndex !== -1 ? row[offerIndex] : '';
      const parsedOffer = parsePrice(rawOffer);

      const status = statusIndex !== -1 ? (row[statusIndex] || '').toUpperCase() : 'DISPONIBLE';
      const isAvailable = !status.includes('AGOTAD') && !status.includes('NO');

      // Si hay precio de oferta menor al de venta:
      // price = precio con descuento (lo que paga el cliente)
      // original_price = precio tachado de referencia
      let finalPrice = parsedPrice;
      let finalOriginalPrice: number | null = null;

      if (parsedOffer && parsedOffer < parsedPrice) {
        finalPrice = parsedOffer;
        finalOriginalPrice = parsedPrice;
      }

      pricesMap.set(id, {
        id,
        price: finalPrice,
        original_price: finalOriginalPrice,
        is_available: isAvailable,
        name: nameIndex !== -1 ? row[nameIndex] : undefined,
      });
    }

    // Guardar en caché local
    savePricesToCache(pricesMap);

    return {
      success: true,
      prices: pricesMap,
    };
  } catch (err: any) {
    return {
      success: false,
      prices: new Map(),
      error: err?.message || 'Error desconocido al conectar con Google Sheets.',
    };
  }
}

/**
 * Guarda los precios descargados en localStorage para persistencia y carga offline instantánea
 */
export function savePricesToCache(pricesMap: Map<number, SheetPriceEntry>): void {
  try {
    const list = Array.from(pricesMap.values());
    localStorage.setItem(STORAGE_KEY_PRICES_CACHE, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEY_PRICES_LAST_SYNC, new Date().toISOString());
  } catch {
    // Ignore cache write errors
  }
}

/**
 * Carga los precios guardados en caché local
 */
export function loadPricesFromCache(): Map<number, SheetPriceEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRICES_CACHE);
    if (!raw) return new Map();
    const list: SheetPriceEntry[] = JSON.parse(raw);
    const map = new Map<number, SheetPriceEntry>();
    for (const item of list) {
      if (item && item.id) {
        map.set(item.id, item);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Aplica los precios de Google Sheets sobre la lista de productos de la tienda
 */
export function applySheetPricesToProducts(
  products: Product[],
  pricesMap: Map<number, SheetPriceEntry>
): Product[] {
  if (pricesMap.size === 0) return products;

  return products.map((product) => {
    const override = pricesMap.get(product.id);
    if (!override) return product;

    return {
      ...product,
      price: override.price,
      original_price: override.original_price ?? product.original_price,
      // Si fue marcado como agotado, se puede reflejar en la etiqueta
      tag: !override.is_available ? 'AGOTADO' : product.tag,
    };
  });
}
