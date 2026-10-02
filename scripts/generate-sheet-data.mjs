import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.resolve('./src/data/products.ts');
const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
const products = JSON.parse(jsonMatch[1]).slice(0, 65);

// 1. Generar CSV con BOM para compatibilidad universal
const csvHeaders = ['ID', 'FOTO', 'REFERENCIA', 'MARCA', 'CATEGORIA', 'GENERO', 'PRECIO_VENTA_COP', 'PRECIO_OFERTA_COP', 'ESTADO'];
const csvLines = [csvHeaders.join(',')];

for (const p of products) {
  const foto = `=IMAGE("${p.image}")`;
  const precioVenta = p.original_price ? p.original_price : p.price;
  const precioOferta = p.original_price ? p.price : '';
  const refEscaped = `"${p.name.replace(/"/g, '""')}"`;
  
  csvLines.push([
    p.id,
    foto,
    refEscaped,
    `"${p.brand}"`,
    `"${p.category}"`,
    `"${p.gender}"`,
    precioVenta,
    precioOferta,
    'DISPONIBLE'
  ].join(','));
}

// UTF-8 BOM (\uFEFF)
fs.writeFileSync('bonanza_plantilla_precios.csv', '\uFEFF' + csvLines.join('\r\n'), 'utf8');
console.log('✅ CSV generado: bonanza_plantilla_precios.csv');

// 2. Generar Google Apps Script de 1 clic para autorelleno en Google Sheets
const appsScriptCode = `/**
 * =======================================================================
 * BONANZA 2020 - AUTO-CARGADOR DE PRECIOS E INVENTARIO PARA GOOGLE SHEETS
 * =======================================================================
 * Instrucciones:
 * 1. En tu Google Sheet, ve a: Extensiones -> Apps Script
 * 2. Borra cualquier código que veas y pega todo este archivo.
 * 3. Haz clic en "Ejecutar" (Run).
 * 4. ¡Listo! Tu pestaña LISTA_PRECIOS se llenará con las 65 referencias,
 *    fotos visibles, precios y formato profesional.
 */

function cargarCatalogoBonanza() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "LISTA_PRECIOS";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  // Encabezados
  var headers = [
    "ID",
    "FOTO",
    "REFERENCIA",
    "MARCA",
    "CATEGORIA",
    "GENERO",
    "PRECIO_VENTA_COP",
    "PRECIO_OFERTA_COP",
    "ESTADO"
  ];

  // Datos de los 65 productos
  var rows = [
${products
  .map((p) => {
    const precioVenta = p.original_price ? p.original_price : p.price;
    const precioOferta = p.original_price ? p.price : '';
    return `    [${p.id}, '=IMAGE("${p.image}")', ${JSON.stringify(p.name)}, ${JSON.stringify(p.brand)}, ${JSON.stringify(p.category)}, ${JSON.stringify(p.gender)}, ${precioVenta}, ${precioOferta ? precioOferta : '""'}, "DISPONIBLE"]`;
  })
  .join(',\n')}
  ];

  // Escribir cabecera y datos
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

  // Formato visual profesional
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#111111");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");

  // Formato de moneda para columnas de precio (G y H)
  sheet.getRange(2, 7, rows.length, 2).setNumberFormat("$ #,##0");

  // Alineaciones
  sheet.getRange(2, 1, rows.length, 1).setHorizontalAlignment("center"); // ID
  sheet.getRange(2, 2, rows.length, 1).setHorizontalAlignment("center"); // FOTO
  sheet.getRange(2, 4, rows.length, 3).setHorizontalAlignment("center"); // Marca, Cat, Gen
  sheet.getRange(2, 9, rows.length, 1).setHorizontalAlignment("center"); // Estado

  // Ajustar anchos de columnas
  sheet.setColumnWidth(1, 50);  // ID
  sheet.setColumnWidth(2, 90);  // FOTO
  sheet.setColumnWidth(3, 300); // REFERENCIA
  sheet.setColumnWidth(4, 120); // MARCA
  sheet.setColumnWidth(5, 110); // CATEGORIA
  sheet.setColumnWidth(6, 90);  // GENERO
  sheet.setColumnWidth(7, 140); // PRECIO_VENTA_COP
  sheet.setColumnWidth(8, 140); // PRECIO_OFERTA_COP
  sheet.setColumnWidth(9, 110); // ESTADO

  // Ajustar altura de filas para ver bien las fotos
  for (var i = 2; i <= rows.length + 1; i++) {
    sheet.setRowHeight(i, 65);
  }

  // Inmovilizar fila 1
  sheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert("✅ ¡Catálogo cargado con éxito! Se añadieron " + rows.length + " referencias con fotos y precios.");
}
`;

fs.writeFileSync('bonanza_apps_script.js', appsScriptCode, 'utf8');
console.log('✅ Google Apps Script generado: bonanza_apps_script.js');
