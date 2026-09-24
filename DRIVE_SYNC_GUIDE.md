# GUÍA DE SINCRONIZACIÓN AUTOMÁTICA CON GOOGLE DRIVE

## Bonanza 2020 · Catálogo en Tiempo Real

Esta solución híbrida permite que **cada vez que subas fotos nuevas a cualquier carpeta de Google Drive**, los productos aparezcan automáticamente en la tienda web, sin necesidad de editar código ni recompilar.

---

### ¿Cómo funciona la solución híbrida?

1. **Sincronización en vivo en la Web:** Al cargar la tienda web, se consulta el endpoint de Google Apps Script en segundo plano. Si hay fotos nuevas, se agregan de inmediato al catálogo con su marca, categoría, tallas e imágenes de alta definición.
2. **Script de respaldo en terminal (`npm run sync`):** Puedes correr un comando en tu computador cuando quieras dejar los productos guardados de forma definitiva en `src/data/products.ts`.

---

## PASO A PASO: CONFIGURACIÓN EN 3 MINUTOS

### 1. Crear el Google Apps Script

1. Abre [script.google.com](https://script.google.com) o ve a tu Google Drive y haz clic en **+ Nuevo > Más > Google Apps Script**.
2. Ponle de nombre al proyecto: **Bonanza 2020 Catalog API**.
3. Borra el código de ejemplo que aparece y pega el contenido completo de:
   👉 [`google-apps-script/Code.js`](google-apps-script/Code.js)

### 2. Publicar como Web App

1. En la parte superior derecha de Apps Script, haz clic en el botón azul **Implementar (Deploy) > Nueva implementación (New deployment)**.
2. Haz clic en el ícono de engranaje (⚙️) a la izquierda y selecciona **Aplicación web (Web app)**.
3. Configura los siguientes campos:
   - **Descripción:** *API Catálogo Bonanza 2020*
   - **Ejecutar como (Execute as):** *Yo (tu correo de Google)*
   - **Quién tiene acceso (Who has access):** **Cualquiera (Anyone)** *(indispensable para que la web pueda consultar las fotos)*.
4. Haz clic en **Implementar**.
5. Te pedirá autorizar permisos de Google Drive la primera vez:
   - Haz clic en *Revisar permisos* > Elige tu cuenta > *Configuración avanzada* > *Ir a Bonanza 2020 Catalog API (no seguro)* > *Permitir*.
6. Copia la **URL de la aplicación web** generada (tiene la forma `https://script.google.com/macros/s/AKfycb.../exec`).

---

### 3. Conectar la URL con la Tienda

Tienes 3 formas sencillas de conectarla:

#### Opción A: Desde la misma Web (Más rápido)

1. En el pie de página (footer) de la tienda web, haz clic en **«Sincronizar Drive»**.
2. Pega la URL generada y haz clic en **«Sincronizar Ahora»**.
3. ¡Listo! La web recordará la URL en tu navegador y se actualizará automáticamente.

#### Opción B: Mediante archivo `.env`

Crea o edita el archivo `.env` en la raíz del proyecto y agrega:

```env
VITE_DRIVE_API_URL="https://script.google.com/macros/s/TU_SCRIPT_ID/exec"
```

#### Opción C: Mediante comando de terminal

Para descargar y guardar los productos directamente en el código fuente:

```bash
npm run sync -- --url="https://script.google.com/macros/s/TU_SCRIPT_ID/exec"
# o si ya lo tienes en .env:
npm run sync
```

---

## REGLAS PARA SUBIR FOTOS EN GOOGLE DRIVE

Para que las referencias se cataloguen de forma impecable automáticamente:

1. **Estructura de Carpetas:**
   - Si subes a `CALZADO HOMBRE / Nike`: El producto se asignará automáticamente a Género: **Hombre**, Marca: **Nike**, Categoría: **Zapatillas**.
   - Si subes a `ROPA HOMBRE / Conjuntos Deportivos`: Se asignará a Categoría: **Conjuntos**, con tallas **S, M, L, XL**.
2. **Nombres de Archivo Recomendados:**
   - Puedes nombrarlas simplemente con el modelo: `Air Jordan 4 Retro Military Black.jpg`.
   - Si deseas especificar el precio en el mismo nombre, escribe el valor: `Dunk Low Panda 185000.jpg` o `Asics Kayano 14 - $230.000.png`.
   - Si no pones precio, el sistema le asigna el precio estándar de la marca (ej. Nike $245.000, Adidas $220.000, On Cloud $260.000, Conjuntos $140.000).
3. **Doble Ángulo (Hover Effect):**
   - Si subes dos fotos del mismo modelo con sufijo `_1` y `_2` (ej. `Jordan4_1.jpg` y `Jordan4_2.jpg`), la primera se usará como vista principal y la segunda como vista al pasar el cursor (suela o ángulo trasero).

---

## CARACTERÍSTICAS TÉCNICAS

- **Cero latencia:** La web inicia inmediatamente con los productos base locales y actualiza el inventario en segundo plano.
- **Caché en Drive:** Google Apps Script almacena los resultados en caché por 10 minutos para responder en menos de 200 milisegundos. Para forzar una lectura inmediata desde Drive, se usa el parámetro `?refresh=true`.
- **CDN de Google:** Todas las fotos se sirven con `lh3.googleusercontent.com/d/{ID}=w800`, garantizando carga instantánea en teléfonos móviles sin consumir recursos del servidor.
