/**
 * =======================================================================
 * BONANZA 2020 - API DE SINCRONIZACIÓN DE CATÁLOGO DESDE GOOGLE DRIVE
 * =======================================================================
 * Este script lee de manera recursiva la carpeta de Google Drive de Bonanza 2020
 * y expone un endpoint JSON seguro y ultra rápido con soporte de caché.
 *
 * Cada nueva foto añadida a cualquier subcarpeta se convierte automáticamente
 * en un producto con su marca, categoría, género, tallas e imagen en CDN.
 */

// ID de la carpeta raíz "CATALOGO BONANZA2020"
const ROOT_FOLDER_ID = "1WPNkUu0kynpaT7ZGco1StC3wudAmgEiD";

// Precios por defecto si el nombre del archivo no incluye precio explícito
const DEFAULT_PRICES = {
  "Nike": 245000,
  "Adidas": 220000,
  "New Balance": 235000,
  "On Cloud": 260000,
  "Asics": 230000,
  "Puma": 195000,
  "Conjuntos": 140000,
  "Camisetas": 85000,
  "Bermudas": 75000,
  "General": 210000
};

/**
 * Endpoint GET principal
 */
function doGet(e) {
  try {
    const forceRefresh = e && e.parameter && e.parameter.refresh === "true";
    const cache = CacheService.getScriptCache();
    const cacheKey = "bonanza_catalog_v1";

    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return createJsonResponse({
          success: true,
          fromCache: true,
          count: JSON.parse(cached).length,
          products: JSON.parse(cached),
          timestamp: new Date().toISOString()
        });
      }
    }

    const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const catalog = [];
    let currentId = 1000; // IDs dinámicos para productos sincronizados

    // Escanear recursivamente el árbol de carpetas
    traverseFolder(rootFolder, [], catalog, currentId);

    // Guardar en caché por 10 minutos (600 segundos)
    try {
      cache.put(cacheKey, JSON.stringify(catalog), 600);
    } catch (cacheErr) {
      Logger.log("Cache limit exceeded, continuing without script cache: " + cacheErr);
    }

    return createJsonResponse({
      success: true,
      fromCache: false,
      count: catalog.length,
      products: catalog,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Recorre las carpetas y extrae imágenes
 */
function traverseFolder(folder, pathArr, catalog, idCounter) {
  const currentPath = [...pathArr, folder.getName()];
  
  // Procesar imágenes en la carpeta actual
  const files = folder.getFiles();
  const fileList = [];

  while (files.hasNext()) {
    const file = files.next();
    const mime = file.getMimeType();
    if (mime.indexOf("image/") !== -1) {
      fileList.push(file);
    }
  }

  // Agrupar fotos si son ángulos del mismo modelo
  const groupedProducts = groupAndBuildProducts(fileList, currentPath, idCounter);
  catalog.push(...groupedProducts);

  // Recorrer subcarpetas
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    traverseFolder(subfolders.next(), currentPath, catalog, idCounter);
  }
}

/**
 * Convierte lista de archivos en objetos Product
 */
function groupAndBuildProducts(files, pathArr, idCounter) {
  const products = [];
  const hierarchy = pathArr.join(" / ");

  // Deducción de género y categoría a partir de la ruta de carpetas
  let gender = "Hombre";
  let category = "Zapatillas";

  const lowerHierarchy = hierarchy.toLowerCase();
  if (lowerHierarchy.indexOf("mujer") !== -1) gender = "Mujer";
  if (lowerHierarchy.indexOf("niño") !== -1 || lowerHierarchy.indexOf("nino") !== -1) gender = "Niño";

  if (lowerHierarchy.indexOf("ropa") !== -1 || lowerHierarchy.indexOf("conjunto") !== -1) {
    category = lowerHierarchy.indexOf("conjunto") !== -1 ? "Conjuntos" : "Ropa";
  } else if (lowerHierarchy.indexOf("running") !== -1 || lowerHierarchy.indexOf("on cloud") !== -1) {
    category = "Running";
  }

  // Deducción de marca
  let brand = "Bonanza Sport";
  const brandKeywords = ["Nike", "Adidas", "New Balance", "On Cloud", "Asics", "Puma", "Jordan"];
  for (let i = 0; i < brandKeywords.length; i++) {
    if (new RegExp(brandKeywords[i], "i").test(hierarchy)) {
      brand = brandKeywords[i];
      break;
    }
  }

  // Agrupar por nombre base (para soportar ángulo frontal + suela)
  const groups = {};

  files.forEach(function (file) {
    const rawName = file.getName();
    const cleanBaseName = cleanProductName(rawName, brand);
    if (!groups[cleanBaseName]) {
      groups[cleanBaseName] = [];
    }
    groups[cleanBaseName].push(file);
  });

  Object.keys(groups).forEach(function (baseName) {
    const fileArr = groups[baseName];
    const primaryFile = fileArr[0];
    const secondaryFile = fileArr.length > 1 ? fileArr[1] : primaryFile;

    const fileId = primaryFile.getId();
    const hoverId = secondaryFile.getId();

    const price = extractPriceFromName(primaryFile.getName(), brand, category);

    // Tallas según categoría
    const isApparel = category === "Conjuntos" || category === "Ropa";
    const sizes = isApparel ? ["S", "M", "L", "XL"] : [37, 38, 39, 40, 41, 42, 43];

    products.push({
      id: "drive_" + fileId.substring(0, 10),
      drive_file_id: fileId,
      name: baseName,
      brand: brand,
      gender: gender,
      category: category,
      price: price,
      original_price: null,
      image: "https://lh3.googleusercontent.com/d/" + fileId + "=w800",
      hover_image: "https://lh3.googleusercontent.com/d/" + hoverId + "=w800",
      sizes: sizes,
      available_sizes: sizes,
      tag: "NUEVO INGRESO",
      rating: 5.0,
      reviews_count: 1,
      is_featured: false,
      description: "Referencia disponible en stock oficial Bonanza 2020 (" + gender + " · " + brand + "). Envíos nacionales y entregas contraentrega en Valledupar."
    });
  });

  return products;
}

/**
 * Limpia el nombre del producto quitando extensiones y patrones numéricos
 */
function cleanProductName(filename, brand) {
  let name = filename.replace(/\.[^/.]+$/, ""); // quitar extensión
  name = name.replace(/[-_](1|2|front|back|sole|side)$/i, ""); // quitar sufijo de ángulo
  name = name.replace(/(\$|\b)\d{5,6}\b/, ""); // quitar precio si está pegado
  name = name.replace(/[-_]+/g, " ").trim(); // guiones a espacios

  // Si el nombre no incluye la marca, prefijarla para mejor presentación
  if (name.toLowerCase().indexOf(brand.toLowerCase()) === -1 && brand !== "Bonanza Sport") {
    name = brand + " " + name;
  }

  // Capitalizar palabras
  return name.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
}

/**
 * Extrae precio si viene escrito en el nombre (ej. "Dunk Low 185000" o "Jordan $240.000")
 */
function extractPriceFromName(filename, brand, category) {
  const match = filename.match(/(\d{3})[.,]?(\d{3})/);
  if (match) {
    const parsed = parseInt(match[1] + match[2], 10);
    if (parsed >= 50000 && parsed <= 900000) {
      return parsed;
    }
  }

  if (DEFAULT_PRICES[brand]) return DEFAULT_PRICES[brand];
  if (DEFAULT_PRICES[category]) return DEFAULT_PRICES[category];
  return DEFAULT_PRICES["General"];
}

/**
 * Helper para responder en JSON con CORS habilitado
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
