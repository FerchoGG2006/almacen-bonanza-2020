import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
const products = JSON.parse(jsonMatch[1]);

// Tomamos los primeros 65 productos del catálogo activo
const mainProducts = products.slice(0, 65);

const headers = ['ID', 'FOTO', 'REFERENCIA', 'MARCA', 'CATEGORIA', 'GENERO', 'PRECIO_VENTA_COP', 'PRECIO_OFERTA_COP', 'ESTADO'];
const rows = [headers.join('\t')];

for (const p of mainProducts) {
  const fotoFormula = `=IMAGE("${p.image}")`;
  const precioOferta = p.original_price ? p.price : '';
  const precioVenta = p.original_price ? p.original_price : p.price;
  rows.push([
    p.id,
    fotoFormula,
    `"${p.name.replace(/"/g, '""')}"`,
    p.brand,
    p.category,
    p.gender,
    precioVenta,
    precioOferta,
    'DISPONIBLE'
  ].join('\t'));
}

fs.writeFileSync('bonanza_plantilla_precios.tsv', rows.join('\n'), 'utf8');
console.log('✅ Generada plantilla TSV con', mainProducts.length, 'productos.');
