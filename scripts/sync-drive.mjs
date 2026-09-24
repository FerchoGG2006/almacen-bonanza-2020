#!/usr/bin/env node

/**
 * =======================================================================
 * BONANZA 2020 - SCRIPT LOCAL DE SINCRONIZACIÓN DE DRIVE
 * =======================================================================
 * Uso:
 *   npm run sync
 *   node scripts/sync-drive.mjs --url="https://script.google.com/macros/s/TU_SCRIPT_ID/exec"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PRODUCTS_FILE = path.join(ROOT_DIR, 'src', 'data', 'products.ts');

// Extraer argumentos
const args = process.argv.slice(2);
let apiUrl = '';

for (const arg of args) {
  if (arg.startsWith('--url=')) {
    apiUrl = arg.split('=')[1].replace(/["']/g, '');
  }
}

// Si no se pasó por argumento, intentar leer de .env o .env.local
if (!apiUrl) {
  const envPaths = [path.join(ROOT_DIR, '.env.local'), path.join(ROOT_DIR, '.env')];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/VITE_DRIVE_API_URL=(.+)/);
      if (match && match[1]) {
        apiUrl = match[1].trim().replace(/["']/g, '');
        break;
      }
    }
  }
}

console.log('\n======================================================');
console.log('⚡ BONANZA 2020 · Sincronizador de Catálogo Google Drive');
console.log('======================================================\n');

if (!apiUrl) {
  console.log('⚠️  No se encontró la URL de la API de Google Apps Script.');
  console.log('\nPara sincronizar el catálogo localmente, puedes:');
  console.log('1. Ejecutar pasando la URL directamente:');
  console.log('   node scripts/sync-drive.mjs --url="https://script.google.com/macros/s/.../exec"\n');
  console.log('2. O agregarla a tu archivo .env:');
  console.log('   VITE_DRIVE_API_URL="https://script.google.com/macros/s/.../exec"\n');
  console.log('Consulta la guía completa en DRIVE_SYNC_GUIDE.md\n');
  process.exit(1);
}

async function runSync() {
  try {
    console.log(`📡 Conectando a Google Apps Script en Drive...`);
    console.log(`🔗 URL: ${apiUrl}\n`);

    const syncUrl = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}refresh=true`;
    const res = await fetch(syncUrl);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.success && !Array.isArray(data.products)) {
      throw new Error(data.error || 'La respuesta no contiene productos válidos.');
    }

    const driveProducts = Array.isArray(data.products) ? data.products : [];
    console.log(`📦 Productos recuperados desde Google Drive: ${driveProducts.length}`);

    // Leer products.ts actual para preservar productos manuales si existen
    let currentProducts = [];
    if (fs.existsSync(PRODUCTS_FILE)) {
      const currentContent = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      // Extraer array JSON existente
      const jsonMatch = currentContent.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          currentProducts = JSON.parse(jsonMatch[1]);
        } catch {
          // Ignorar error de parsing y continuar
        }
      }
    }

    // Fusionar productos evitando duplicados por ID de foto
    const driveIds = new Set();
    const names = new Set();

    currentProducts.forEach((p) => {
      const match = (p.image || '').match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) driveIds.add(match[1]);
      names.add((p.name || '').trim().toLowerCase());
    });

    let newCount = 0;
    const newItems = [];

    driveProducts.forEach((dp, index) => {
      const fileId = dp.drive_file_id || ((dp.image || '').match(/\/d\/([a-zA-Z0-9_-]+)/) || [])[1];
      const normName = (dp.name || '').trim().toLowerCase();

      if ((fileId && driveIds.has(fileId)) || names.has(normName)) {
        return; // ya existe
      }

      newCount++;
      const nextId = currentProducts.length + newCount;
      newItems.push({
        id: nextId,
        name: dp.name,
        brand: dp.brand,
        gender: dp.gender,
        category: dp.category,
        price: Number(dp.price) || 220000,
        original_price: dp.original_price || null,
        image: dp.image,
        hover_image: dp.hover_image || dp.image,
        sizes: dp.sizes || [37, 38, 39, 40, 41, 42, 43],
        available_sizes: dp.available_sizes || dp.sizes,
        tag: dp.tag || 'NUEVO INGRESO',
        rating: dp.rating || 5.0,
        reviews_count: dp.reviews_count || 1,
        is_featured: Boolean(dp.is_featured),
        description: dp.description || 'Disponible en stock oficial Bonanza 2020 con entregas contraentrega en Valledupar y envíos nacionales.',
      });
    });

    const finalProducts = [...newItems, ...currentProducts];

    // Generar archivo TypeScript
    const fileHeader = `import { Product } from '../types/index';\n\nexport const PRODUCTS_DATA: Product[] = `;
    const fileContent = `${fileHeader}${JSON.stringify(finalProducts, null, 2)};\n`;

    fs.writeFileSync(PRODUCTS_FILE, fileContent, 'utf8');

    console.log(`\n✅ ¡Catálogo actualizado exitosamente!`);
    console.log(`   - Nuevas referencias agregadas: ${newCount}`);
    console.log(`   - Total de referencias en catálogo: ${finalProducts.length}`);
    console.log(`   - Archivo guardado: src/data/products.ts\n`);

  } catch (err) {
    console.error(`\n❌ Error durante la sincronización:`, err.message);
    process.exit(1);
  }
}

runSync();
