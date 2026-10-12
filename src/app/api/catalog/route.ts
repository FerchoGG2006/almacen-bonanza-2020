import { NextResponse } from 'next/server';
import { PRODUCTS_DATA } from '@/data/products';
import { mergeCatalogs, DEFAULT_DRIVE_API_URL } from '@/services/driveSync';
import { fetchPricesFromGoogleSheet, applySheetPricesToProducts } from '@/services/googleSheetsPrices';

// Revalidar en segundo plano cada 300 segundos (5 minutos)
export const revalidate = 300;

export async function GET() {
  try {
    let allProducts = PRODUCTS_DATA;

    // 1. Sincronización automática con Google Apps Script de Google Drive
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const driveRes = await fetch(DEFAULT_DRIVE_API_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 },
      });
      clearTimeout(timeoutId);

      if (driveRes.ok) {
        const driveData = await driveRes.json();
        if (driveData && Array.isArray(driveData.products) && driveData.products.length > 0) {
          const { merged } = mergeCatalogs(PRODUCTS_DATA, driveData.products);
          allProducts = merged;
        }
      }
    } catch (driveErr) {
      console.warn('Auto sync Drive warning (using curated fallback):', driveErr);
    }

    // 2. Sincronización de precios y stock desde Google Sheets
    try {
      const sheetRes = await fetchPricesFromGoogleSheet();
      if (sheetRes.success && sheetRes.prices.size > 0) {
        allProducts = applySheetPricesToProducts(allProducts, sheetRes.prices);
      }
    } catch (sheetErr) {
      console.warn('Auto sync Sheets prices warning (using fallback):', sheetErr);
    }

    return NextResponse.json(
      {
        success: true,
        count: allProducts.length,
        products: allProducts,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        count: PRODUCTS_DATA.length,
        products: PRODUCTS_DATA,
        error: error?.message || 'Error en endpoint de catálogo',
      },
      { status: 200 }
    );
  }
}
