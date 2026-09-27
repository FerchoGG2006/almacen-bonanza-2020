import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.resolve('./src/data/products.ts');
const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);

if (!jsonMatch) {
  throw new Error('No se encontró PRODUCTS_DATA en products.ts');
}

const products = JSON.parse(jsonMatch[1]);

// Diccionario de nombres exactos auditados visualmente foto por foto (IDs 1 a 47)
const AUDITED_NAMES = {
  1: {
    name: "Nike SB Dunk Low Pro 'White / Black Gum'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Silueta icónica Nike SB Dunk Low en cuero blanco premium, Swoosh negro en contraste y suela de goma Gum clásica de alta tracción skate.",
    tag: "MÁS VENDIDO"
  },
  2: {
    name: "Nike SB Dunk Low 'Black Pigeon' (Jeff Staple)",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Edición especial de colección Nike SB Dunk Low Black Pigeon diseñada por Jeff Staple. Capellada en nobuk negro con bordado de la paloma Pigeon y suela carmesí.",
    tag: "DROP EXCLUSIVO"
  },
  3: {
    name: "Air Jordan 4 Retro 'Bred' (Black Cement)",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Leyenda del básquetbol y streetwear. Air Jordan 4 con capellada en nobuk negro, alas de soporte cemento, cámara de aire visible y acentos rojos University Red.",
    tag: "LEGENDARIO"
  },
  4: {
    name: "Nike Skate 'Metallic Silver'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Silueta chunky urbana Nike Skate con estética metálica futurista. Capellada en malla plateada transpirable, estructura de jaula geométrica con logotipo Nike Skate en talón y suela robusta de alta amortiguación.",
    tag: "TOP TENDENCIA"
  },
  5: {
    name: "Air Jordan 4 Retro 'Military Blue'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Clásico OG de 1989 reeditado. Cuero blanco texturizado, puntera en gamuza gris neutro, ojales y talón en Military Blue con suela de goma Gum.",
    tag: "RETRO OG"
  },
  6: {
    name: "Nike Pegasus Trail 4 'Summit White / Burgundy'",
    brand: "Nike",
    category: "Running",
    gender: "Hombre",
    description: "Calzado de trail y running versátil de la línea Nike Trail ATC. Tecnología Flywire para sujeción dinámica, suela taqueada para asfalto y tierra.",
    tag: "TRAIL RUNNING"
  },
  7: {
    name: "Adidas Superstar ADV 'Core Black / White Gum'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Hombre",
    description: "La clásica silueta de puntera concha Shell Toe en suave nobuk negro, tres rayas blancas dentadas y suela de caucho vulcanizado Gum de gran durabilidad.",
    tag: "CLÁSICO"
  },
  8: {
    name: "Adidas Swift Run 1.0 'Core Black / Cloud White'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Calzado diario ultra liviano con tejido knit elástico que se adapta como un guante. Mediasuela de espuma amortiguadora y las tres rayas en contraste.",
    tag: "CONFORT DIARIO"
  },
  9: {
    name: "Adidas Supernova Rise 'Dreamstrike Core Black'",
    brand: "Adidas",
    category: "Running",
    gender: "Hombre",
    description: "Zapatillas de running de alto rendimiento equipadas con la nueva espuma Dreamstrike+ para una pisada súper suave y transición dinámica sin esfuerzo.",
    tag: "RUNNING PRO"
  },
  10: {
    name: "Adidas Terrex Soulstride GORE-TEX 'Black / Solar Red'",
    brand: "Adidas",
    category: "Running",
    gender: "Hombre",
    description: "Calzado todoterreno impermeable con membrana GORE-TEX transpirable, suela Traxion de máximo agarre y amortiguación reforzada para senderos y lluvia.",
    tag: "OUTDOOR GTX"
  },
  11: {
    name: "Adidas Campus 00s 'Core Black / Cloud White'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Hombre",
    description: "El fenómeno del skate y streetwear contemporáneo. Horma ancha acolchada, gamuza negra gruesa, cordones anchos y suela de caucho retro.",
    tag: "MÁS VENDIDO"
  },
  12: {
    name: "Adidas Supermagma Running 'Triple Black'",
    brand: "Adidas",
    category: "Running",
    gender: "Hombre",
    description: "Zapatillas running futuristas con mediasuela geométrica Supermagma acanalada, malla monocromática en negro total y detalles reflectivos.",
    tag: "TENDENCIA"
  },
  13: {
    name: "New Balance 530 'Black / White'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Regreso del clásico de running de los 90. Malla transpirable negra con superposiciones curvadas y amortiguación ABZORB para absorción de impactos.",
    tag: "MÁS VENDIDO"
  },
  14: {
    name: "New Balance 9060 'Sea Salt / Surf Blue'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Silueta escultórica y vanguardista de la serie 99X. Gamuza beige Sea Salt, malla deportiva, detalles celestes Surf y suela ondulada con cápsulas ABZORB SBS.",
    tag: "TOP TENDENCIA"
  },
  15: {
    name: "New Balance 9060 'Eclipse Grey / Crimson'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Diseño audaz con estética retro-futurista. Bloques en gris marengo con sutiles acentos carmesí en los amortiguadores de la entresuela.",
    tag: "NUEVO INGRESO"
  },
  16: {
    name: "New Balance 9060 'Triple Black / Phantom'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Versión monocromática negra con mezcla de cuero brillante, gamuza y malla balística. Plataforma ondulada de máxima comodidad y estilo urbano.",
    tag: "URBAN STYLE"
  },
  17: {
    name: "New Balance 9060 'Sea Salt / Rain Cloud'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "La combinación de colores más buscada del 9060. Tonos neutros crema, gris suave y acentos reflectivos con barra estabilizadora en el talón.",
    tag: "MÁS BUSCADO"
  },
  18: {
    name: "New Balance 9060 'Castlerock / Shadow Grey'",
    brand: "New Balance",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Paleta icónica de New Balance con tonos grises y negros superpuestos en gamuza premium de pelo corto y malla técnica.",
    tag: "EDICIÓN LIMITADA"
  },
  19: {
    name: "On Cloudtilt 'All White / Ivory'",
    brand: "On Cloud",
    category: "Running",
    gender: "Hombre",
    description: "Ingeniería suiza de precisión con tecnología CloudTec Phase que se comprime secuencialmente para un desplazamiento suave como una nube.",
    tag: "SWISS TECH"
  },
  20: {
    name: "On Cloudtilt 'All White / Ivory' (Edición Especial)",
    brand: "On Cloud",
    category: "Running",
    gender: "Hombre",
    description: "Silueta ultraligera de perfil bajo en blanco marfil con sistema de cordones rápidos y amortiguación de última generación.",
    tag: "NUEVO INGRESO"
  },
  21: {
    name: "On Cloudtilt LOEWE 'Sand / Orange'",
    brand: "On Cloud",
    category: "Running",
    gender: "Hombre",
    description: "Colaboración de alta costura inspirada en la paleta de Loewe. Detalles en gamuza arena, tiradores naranja y mediasuela CloudTec Phase.",
    tag: "COLABORACIÓN"
  },
  22: {
    name: "On Cloudsurfer Running 'Grey / Berry Fade'",
    brand: "On Cloud",
    category: "Running",
    gender: "Hombre",
    description: "Zapatillas de entrenamiento diario con degradado de gris a bayas. Espuma Helion supercrítica para máximo retorno de energía en cada zancada.",
    tag: "RUNNING PRO"
  },
  23: {
    name: "On Cloudsurfer Running 'All Black / White'",
    brand: "On Cloud",
    category: "Running",
    gender: "Hombre",
    description: "Acabado minimalista en negro mate sobre mediasuela blanca CloudTec. Perfectas tanto para entrenar como para combinar en tu outfit diario.",
    tag: "MÁS VENDIDO"
  },
  24: {
    name: "Asics GEL-Kayano 14 'Triple Black / Silver'",
    brand: "Asics",
    category: "Running",
    gender: "Hombre",
    description: "La estética retro-running de principios de los 2000 en su versión más codiciada. Inserciones de tecnología GEL visibles y soporte de estabilidad.",
    tag: "TOP TENDENCIA"
  },
  25: {
    name: "Asics GEL-NYC 'White / Midnight Navy'",
    brand: "Asics",
    category: "Running",
    gender: "Hombre",
    description: "Inspirada en el estilo de vida de Nueva York. Fusión de elementos de GEL-Nimbus 3 y MC-PLUS V con cápsulas GEL de amortiguación ligera.",
    tag: "NUEVO INGRESO"
  },
  26: {
    name: "Asics GEL-Kayano 14 'Pure Silver / Dark Green'",
    brand: "Asics",
    category: "Running",
    gender: "Hombre",
    description: "Combinación icónica de malla plateada metálica con cápsulas de gel en verde esmeralda y líneas deportivas de competición.",
    tag: "RETRO RUNNER"
  },
  27: {
    name: "Puma Suede XL 'Black / White'",
    brand: "Puma",
    category: "Zapatillas",
    gender: "Hombre",
    description: "La legendaria Puma Suede reinventada con proporciones extra grandes inspiradas en la cultura skate de los años 90 y 2000.",
    tag: "MÁS VENDIDO"
  },
  28: {
    name: "Puma Suede Classic 'Black / Shadow Grey'",
    brand: "Puma",
    category: "Zapatillas",
    gender: "Hombre",
    description: "La silueta que definió el hip-hop y el b-boying. Gamuza negra auténtica con franja Formstrip en gris sombra y suela texturizada.",
    tag: "CLÁSICO"
  },
  29: {
    name: "Puma Palermo 'Shadow Grey / Black'",
    brand: "Puma",
    category: "Zapatillas",
    gender: "Hombre",
    description: "Ícono de las terrazas de fútbol de los 80. Construcción con puntera T-toe, etiqueta de la marca en lámina dorada y suela de goma de bajo perfil.",
    tag: "TERRACE STYLE"
  },
  30: {
    name: "Nike Air Max Portal 'Triple Black / White'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Mujer",
    description: "Nueva silueta de la familia Air Max para mujer. Unidad de aire visible envolvente en el talón, malla transpirable y estética estilizada.",
    tag: "NUEVO INGRESO"
  },
  31: {
    name: "Nike Air Force 1 '07 'Triple Black'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Mujer",
    description: "El clásico indiscutible en acabado total black. Cuero resistente con costuras reforzadas y amortiguación Nike Air oculta.",
    tag: "BÁSICO INFALIBLE"
  },
  32: {
    name: "Nike Invincible 3 ZoomX 'Black / Hyper Pink'",
    brand: "Nike",
    category: "Running",
    gender: "Mujer",
    description: "Máxima amortiguación para tus carreras o caminatas con espuma ZoomX de respuesta ultrasuave y detalles vibrantes en rosa y azul.",
    tag: "MÁXIMA AMORTIGUACIÓN"
  },
  33: {
    name: "Nike V2K Run 'Sail / Metallic Silver'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Mujer",
    description: "Lo retro se vuelve futurista. Diseño nostálgico inspirado en los modelos de running de los 2000 con jaula translúcida y suela gruesa con plataforma.",
    tag: "TOP TENDENCIA"
  },
  34: {
    name: "Nike Initiate 'White / Lilac Pink'",
    brand: "Nike",
    category: "Running",
    gender: "Mujer",
    description: "Zapatillas de running confortables con soporte transpirable, detalles reflectivos y acentos pastel en lila y rosa para tu rutina diaria.",
    tag: "CONFORT DIARIO"
  },
  35: {
    name: "Nike Air Max Portal 'Black / White Sole'",
    brand: "Nike",
    category: "Zapatillas",
    gender: "Mujer",
    description: "Contraste moderno de capellada negra con suela blanca y cámara de aire transparente. Estilo y comodidad durante todo el día.",
    tag: "AIR MAX STYLE"
  },
  36: {
    name: "Adidas Originals Samba OG 'Core Black / White'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Mujer",
    description: "El calzado más viral y versátil del momento. Piel suave negra, puntera de ante en T, tres rayas dentadas en blanco y suela de caramelo.",
    tag: "MÁS VENDIDO"
  },
  37: {
    name: "Adidas Runfalcon 3.0 'Cloud White / Lucid Blue'",
    brand: "Adidas",
    category: "Running",
    gender: "Mujer",
    description: "Ligeras, frescas y amortiguadas con mediasuela Cloudfoam para acompañarte en tus entrenamientos de gimnasio, caminatas o trote.",
    tag: "LIVIANAS"
  },
  38: {
    name: "Adidas Originals Samba OG 'Black Textured'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Mujer",
    description: "Edición especial de Samba con cuero texturizado craquelado que aporta un toque de lujo y personalidad a cualquier outfit casual.",
    tag: "EDICIÓN ESPECIAL"
  },
  39: {
    name: "Adidas Ultraboost Light 'Core Black / White'",
    brand: "Adidas",
    category: "Running",
    gender: "Mujer",
    description: "La tecnología Ultraboost más liviana de la historia con cápsulas Light BOOST que ofrecen un retorno de energía supremo en cada paso.",
    tag: "MÁXIMO BOOST"
  },
  40: {
    name: "Adidas Handball Spezial 'Metallic Silver / Grey'",
    brand: "Adidas",
    category: "Zapatillas",
    gender: "Mujer",
    description: "Auténtica herencia deportiva vintage con acabado foil plateado metálico y gamuza gris claro sobre suela de goma clásica.",
    tag: "TENDENCIA VINTAGE"
  },
  41: {
    name: "Adidas Supernova Solution 'Wonder Beige / Gum'",
    brand: "Adidas",
    category: "Running",
    gender: "Mujer",
    description: "Silueta running de soporte para mujer en tono beige neutro elegante con varillas de soporte estables y suela de caucho color caramelo.",
    tag: "NUEVO INGRESO"
  },
  42: {
    name: "On Cloudtilt LOEWE 'Sand / White'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Zapatillas suizas de diseño de pasarela. Tejido técnico arena, logo Loewe integrado y tecnología CloudTec Phase para flotar al caminar.",
    tag: "ALTA GAMA"
  },
  43: {
    name: "On Cloudtilt Waterproof 'All Black'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Protección 100% impermeable contra lluvia y charcos en un elegante diseño monocromático negro con elementos reflectantes nocturnos.",
    tag: "WATERPROOF"
  },
  44: {
    name: "On Cloudsurfer Running 'All White / Undyed'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Comodidad total en blanco inmaculado. Espuma Helion optimizada por ordenador para una amortiguación que redefine la pisada.",
    tag: "PURE WHITE"
  },
  45: {
    name: "On Cloudrunner 2 'White / Rose Pink'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Soporte y amortiguación reconfortante para mujer en suave combinación de blanco y rosa pastel, ideal para carreras y uso diario.",
    tag: "CONFORT & SOPORTE"
  },
  46: {
    name: "On Cloudsurfer Running 'Grey / Flame Red Fade'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Diseño aerodinámico con transición de gris a negro y toques rojo fuego. Amortiguación CloudTec Phase que reduce el impacto en las articulaciones.",
    tag: "EDICIÓN FADE"
  },
  47: {
    name: "On Cloudmonster 'White / Olive / Green'",
    brand: "On Cloud",
    category: "Running",
    gender: "Mujer",
    description: "Los elementos Cloud más grandes de la marca suiza para un despegue monstruoso y máxima diversión corriendo o caminando.",
    tag: "MONSTER CLOUD"
  }
};

let updatedCount = 0;

products.forEach(p => {
  if (AUDITED_NAMES[p.id]) {
    const update = AUDITED_NAMES[p.id];
    p.name = update.name;
    p.brand = update.brand;
    p.category = update.category;
    p.gender = update.gender;
    p.description = update.description;
    p.tag = update.tag;
    updatedCount++;
  }
});

console.log(`✅ Se actualizaron con nombres visualmente exactos: ${updatedCount} productos.`);

// Guardar archivo actualizado
const output = `import { Product } from '../types/index';\n\nexport const PRODUCTS_DATA: Product[] = ${JSON.stringify(products, null, 2)};\n`;
fs.writeFileSync(PRODUCTS_FILE, output, 'utf8');
console.log('💾 Catálogo guardado exitosamente en products.ts');
