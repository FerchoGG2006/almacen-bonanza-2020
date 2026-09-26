import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PRODUCTS_FILE = path.join(ROOT_DIR, 'src', 'data', 'products.ts');

const ON_CLOUD_MODELS = [
  'On Cloudmonster 2',
  'On Cloudsurfer Running',
  'On Cloudtilt LOEWE Edition',
  'On Cloud 5 Coast',
  'On Cloudrunner 2',
  'On Cloudstratus 3',
  'On Cloudswift 3 Pro',
  'On Cloudflow 4 Speed',
  'On Cloud X 3 Shift',
  'On Cloudpulse Training',
  'On Cloudaway Travel',
  'On Cloudhorizon Trail',
  'On Cloudultra Off-Road',
  'On Cloudnova Streetwear'
];

const ON_CLOUD_COLORS = [
  'All White / Pure',
  'Triple Black',
  'Frost / Cobalt Blue',
  'Glacier Ice / Alloy',
  'Eclipse / Black Carbon',
  'Undyed White Minimal',
  'Alloy / Pure Titanium',
  'Ivory / Flame Orange',
  'Mineral / Slate Grey',
  'Zinc / Shadow Black',
  'Magnet / Shark Navy',
  'Pearl / Cream White'
];

const NIKE_MODELS = [
  "Nike Air Force 1 '07",
  'Nike Dunk Low Retro',
  'Air Jordan 4 Retro',
  'Air Jordan 1 Mid',
  "Nike Air Max Plus 'Tn' Drift",
  'Nike Zoom Vomero 5',
  'Nike P-6000 Athletic',
  'Nike SB Dunk Low Pro',
  'Air Jordan 3 Retro',
  'Nike Air Max 90 Classic',
  'Nike Shox TL Chrome',
  'Nike Air Pegasus 40',
  'Nike Cortez Vintage',
  'Air Jordan 1 Low OG',
  'Nike Blazer Mid 77',
  'Nike Dunk High Retro'
];

const NIKE_COLORS = [
  'Triple White',
  'Panda Edition',
  'Military Black',
  'Photon Dust / Grey',
  'Phantom Grey / Sail',
  'Black Gum Classic',
  'University Blue',
  'Pine Green',
  'Infrared Classic',
  'White Cement',
  'Pure Platinum',
  'Metallic Silver',
  'Olive Light / Sail',
  'Court Purple',
  'Bred Retro',
  'Midnight Navy'
];

const ADIDAS_MODELS = [
  'Adidas Originals Samba OG',
  'Adidas Campus 00s Skate',
  'Adidas Gazelle Bold Platform',
  'Adidas Superstar Classic',
  'Adidas Spezial Handball',
  'Adidas Forum Low 84',
  'Adidas Ultraboost Light 23',
  'Adidas SL 72 Vintage',
  'Adidas Bad Bunny Response CL',
  'Adidas Adi2000 Skateboard'
];

const ADIDAS_COLORS = [
  'Cloud White / Core Black',
  'Core Black Gum',
  'Collegiate Green',
  'Wonder White / Off White',
  'Shadow Navy',
  'Preloved Red',
  'Silver Metallic',
  'Grey Two / Gum',
  'Chalk White / Sand',
  'Aluminium Grey'
];

const NEW_BALANCE_MODELS = [
  'New Balance 9060',
  'New Balance 550 Retro',
  'New Balance 1906R Protection Pack',
  'New Balance 2002R Castlerock',
  'New Balance 574 Core',
  'New Balance 530 Silver Metallic',
  'New Balance 327 Vintage Runner',
  'New Balance 860v2 Tech'
];

const NEW_BALANCE_COLORS = [
  'Sea Salt / Rain Cloud',
  'Castlerock Grey',
  'White Green Vintage',
  'Vintage Indigo Navy',
  'Triple White',
  'Silver / Steel Grey',
  'Washed Burgundy',
  'Shadow Grey',
  'Phantom Black'
];

const ASICS_MODELS = [
  'Asics GEL-Kayano 14',
  'Asics GEL-NYC Streetwear',
  'Asics GT-2160 Runner',
  'Asics GEL-1130 Retro',
  'Asics GEL-Nimbus 26'
];

const ASICS_COLORS = [
  'Silver Cream',
  'Graphite Grey / Pure Silver',
  'White Pure Silver',
  'Black / Pure Silver',
  'Cream / Pure Gold'
];

const PUMA_MODELS = [
  'Puma Palermo Leather',
  'Puma Suede Classic XXI',
  'Puma Velophasis Technisch',
  'Puma Slipstream Retro',
  'Puma Army Trainer',
  'Puma Caven 2.0'
];

const PUMA_COLORS = [
  'Alpine Snow / White',
  'Black / White Classic',
  'Vapor Grey / Gum',
  'Navy / Warm White',
  'Puma White / Club Gold'
];

const BONANZA_CONJUNTOS_MODELS = [
  'Conjunto Deportivo Microfibra Tech Pro',
  'Conjunto Streetwear Training Slim Fit',
  'Conjunto Deportivo Zip-Up Essential',
  'Conjunto Chándal Microfibra Air Flow',
  'Conjunto Deportivo Sportswear Pro',
  'Conjunto Tech Tracksuit Bonanza',
  'Conjunto Retro Windrunner Sport',
  'Conjunto Training Dry-Fit Performance'
];

const CONJUNTO_COLORS = [
  'Navy Blue',
  'Black Carbon',
  'Olive Military',
  'Dark Steel',
  'Graphite Grey',
  'Midnight Black',
  'Sage Green',
  'Obsidian / White'
];

const BONANZA_ROPA_MODELS = [
  'Suéter Deportivo Microfibra Dry-Fit',
  'Camiseta Graphic Streetwear Boxy Fit',
  'Jogger Cargo Streetwear Elastic',
  'Buzo Hoodie Oversize Heavy Cotton',
  'Bermudas Deportivas Microfibra Air',
  'Pantaloneta Training 2-en-1 Pro',
  'Camiseta Oversize Street Classic',
  'Suéter Cuello Texturizado Premium',
  'Buzo Capota Street Techwear',
  'Short Deportivo Running Microfibra'
];

const ROPA_COLORS = [
  'Black Carbon',
  'Dark Grey Heather',
  'Navy Blue',
  'Olive Military',
  'Off-White Classic',
  'Sand Khaki',
  'Acid Washed Black',
  'Washed Anthracite',
  'Royal Blue',
  'Military Forest'
];

const BONANZA_SLIDES_MODELS = [
  'Chanclas Slide Comfort Adilette',
  'Sandalias Deportivas Relax Foam',
  'Chanclas Urban Street Slide',
  'Chanclas Slide Foam Pillow Comfort',
  'Sandalias Urban Style Summer'
];

const SLIDES_COLORS = [
  'Triple Black',
  'Black / White Stripes',
  'Black / Red Stripes',
  'Navy / White Classic',
  'Graphite / Carbon',
  'White / Black Stripes',
  'Olive / Black'
];

const FUTBOL_MODELS = [
  'Camiseta Fútbol Retro Edición Colección',
  'Camiseta Selección Especial Conmemorativa',
  'Camiseta Club Legend Retro Vintage',
  'Camiseta Edición Hincha Oficial Pro'
];

function isHash(str) {
  if (!str) return true;
  const s = str.trim();
  if (/^[0-9A-Fa-f]{8}[-_ ]?[0-9A-Fa-f]{4}/.test(s)) return true;
  if (/^On Cloud [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Puma [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Nike [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/^Adidas [0-9A-Fa-f]{8}/i.test(s)) return true;
  if (/IMG[_\s-]?\d+/i.test(s)) return true;
  if (/^[0-9A-F\s-]{16,}$/i.test(s)) return true;
  const words = s.split(/[\s-_]+/);
  if (words.some((w) => w.length >= 8 && /^[0-9A-Fa-f]+$/.test(w))) return true;
  return false;
}

function pick(arr, index, offset = 0) {
  return arr[(index + offset) % arr.length];
}

function cleanAndFormatCatalog() {
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
  if (!jsonMatch) {
    throw new Error('No se encontró el array PRODUCTS_DATA en products.ts');
  }

  const rawProducts = JSON.parse(jsonMatch[1]);
  console.log(`📦 Total productos leídos: ${rawProducts.length}`);

  // Separar los 65 originales curados de alta prioridad
  const curated = rawProducts.filter((p) => p.id <= 65);
  // Ordenar los curados por ID (1 a 65)
  curated.sort((a, b) => a.id - b.id);
  console.log(`⭐ Productos curados de alta prioridad (primeros en portada): ${curated.length}`);

  // Los demás son productos sincronizados de Drive (IDs > 65)
  const synced = rawProducts.filter((p) => p.id > 65);
  console.log(`🔄 Productos de inventario Drive para sanear: ${synced.length}`);

  // Contadores para nombres únicos deterministas
  const counters = {
    onCloud: 0,
    nike: 0,
    adidas: 0,
    newBalance: 0,
    asics: 0,
    puma: 0,
    conjuntos: 0,
    ropa: 0,
    slides: 0,
    futbol: 0,
    general: 0
  };

  const sanitizedSynced = synced.map((p, idx) => {
    let name = p.name;
    let price = p.price;
    let tag = p.tag || 'NUEVO INGRESO';
    let brand = p.brand;
    const category = p.category;
    const gender = p.gender || 'Hombre';

    // Normalizar precio si tiene números absurdos de hash
    const needsNewName = isHash(name);

    if (brand === 'On Cloud') {
      const c = counters.onCloud++;
      const model = pick(ON_CLOUD_MODELS, c);
      const color = pick(ON_CLOUD_COLORS, c, 3);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 260000;
      tag = 'RUNNING PRO';
    } else if (brand === 'Nike') {
      const c = counters.nike++;
      const model = pick(NIKE_MODELS, c);
      const color = pick(NIKE_COLORS, c, 5);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 245000;
      tag = c % 3 === 0 ? 'MÁS VENDIDO' : 'TENDENCIA';
    } else if (brand === 'Adidas') {
      const c = counters.adidas++;
      const model = pick(ADIDAS_MODELS, c);
      const color = pick(ADIDAS_COLORS, c, 2);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 220000;
      tag = c % 4 === 0 ? 'RETRO CLASSIC' : 'NUEVO INGRESO';
    } else if (brand === 'New Balance') {
      const c = counters.newBalance++;
      const model = pick(NEW_BALANCE_MODELS, c);
      const color = pick(NEW_BALANCE_COLORS, c, 4);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 240000;
      tag = 'STREETWEAR';
    } else if (brand === 'Asics') {
      const c = counters.asics++;
      const model = pick(ASICS_MODELS, c);
      const color = pick(ASICS_COLORS, c, 1);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 230000;
      tag = 'PERFORMANCE';
    } else if (brand === 'Puma') {
      const c = counters.puma++;
      const model = pick(PUMA_MODELS, c);
      const color = pick(PUMA_COLORS, c, 3);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 195000;
      tag = 'CLASSIC';
    } else if (category === 'Conjuntos') {
      const c = counters.conjuntos++;
      const model = pick(BONANZA_CONJUNTOS_MODELS, c);
      const color = pick(CONJUNTO_COLORS, c, 2);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      price = 140000;
      tag = 'OFERTA PACK';
    } else if (category === 'Ropa') {
      const c = counters.ropa++;
      const model = pick(BONANZA_ROPA_MODELS, c);
      const color = pick(ROPA_COLORS, c, 4);
      if (needsNewName) {
        name = `${model} '${color}'`;
      }
      // Alternar precios reales de ropa
      price = c % 3 === 0 ? 85000 : c % 3 === 1 ? 95000 : 110000;
      tag = 'STREET STYLE';
    } else if (category === 'Zapatillas') {
      // Calzado Bonanza Sport (Chanclas/Sandalias o Sneakers Urbanos)
      const c = counters.slides++;
      const isSlide = c % 2 === 0;
      if (isSlide) {
        const model = pick(BONANZA_SLIDES_MODELS, c);
        const color = pick(SLIDES_COLORS, c, 1);
        if (needsNewName) {
          name = `${model} '${color}'`;
        }
        price = 95000;
        tag = 'CONFORT DIARIO';
      } else {
        const model = pick(ADIDAS_MODELS, c);
        const color = pick(ADIDAS_COLORS, c, 3);
        if (needsNewName) {
          name = `${model} '${color}'`;
        }
        price = 210000;
        brand = 'Adidas';
        tag = 'URBANO';
      }
    } else if (category === 'Camisetas' || brand === 'Fútbol Club') {
      const c = counters.futbol++;
      const model = pick(FUTBOL_MODELS, c);
      if (needsNewName) {
        name = `${model} (Edición #${(c % 10) + 1})`;
      }
      price = 85000;
      tag = 'RETRO FOOTBALL';
    } else {
      const c = counters.general++;
      if (needsNewName) {
        name = `Referencia Urban Sport Bonanza (Ref. #${c + 100})`;
      }
      price = 210000;
    }

    // Asegurar tallas coherentes
    const isApparel = category === 'Conjuntos' || category === 'Ropa' || category === 'Camisetas';
    const cleanSizes = isApparel ? ['S', 'M', 'L', 'XL'] : [37, 38, 39, 40, 41, 42, 43];

    return {
      ...p,
      name,
      brand,
      price,
      sizes: cleanSizes,
      available_sizes: cleanSizes,
      tag,
      description: `Referencia oficial en stock Bonanza 2020 (${gender} · ${brand}). Alta calidad, materiales transpirables, pago contra entrega en Valledupar y envíos a toda Colombia.`
    };
  });

  // UNIR: Curados primero (1 a 65), luego todo el inventario restante saneado
  const finalProducts = [...curated, ...sanitizedSynced];

  // Re-indexar IDs consecutivos limpios del 1 al N
  finalProducts.forEach((p, i) => {
    p.id = i + 1;
  });

  const fileHeader = `import { Product } from '../types/index';\n\nexport const PRODUCTS_DATA: Product[] = `;
  const fileContent = `${fileHeader}${JSON.stringify(finalProducts, null, 2)};\n`;

  fs.writeFileSync(PRODUCTS_FILE, fileContent, 'utf8');

  console.log(`\n🎉 ¡Catálogo saneado con éxito!`);
  console.log(`   - Productos curados en portada (posiciones 1 a 65): ${curated.length}`);
  console.log(`   - Productos de inventario renombrados y saneados: ${sanitizedSynced.length}`);
  console.log(`   - Total final en catálogo: ${finalProducts.length}`);
  console.log(`   - Archivo escrito: src/data/products.ts\n`);
}

cleanAndFormatCatalog();
