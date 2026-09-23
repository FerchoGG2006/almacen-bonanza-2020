# INSTRUCCIONES PARA AGENTES DE IA (AGENTS.MD)

Bienvenido al espacio de trabajo de **Bonanza 2020**. Si eres un nuevo asistente o agente abriendo este proyecto en una nueva pestaña o sesión, este documento contiene el contexto operativo indispensable.

## 1. Contexto del Proyecto
- **Negocio:** Bonanza 2020.
- **Tienda Física:** Calle 16B # 7A-55 Barrio Centro, Valledupar, Cesar, Colombia.
- **Teléfono Oficial / WhatsApp:** +57 316 7675967 (`573167675967`).
- **Tipo de Proyecto:** E-commerce web de alto rendimiento para calzado y ropa deportiva.
- **Archivos Principales:**
  - `index.html`: Aplicación principal (interfaz limpia que carga `./dist/main.js`).
  - `src/`: Arquitectura de componentes TypeScript modulares:
    - `src/types/`: Interfaces y tipos de datos (`Product`, `CartItem`, `AppState`, `HeroDrop`).
    - `src/components/`: `Hero3D.ts`, `ProductCard.ts`, `Catalog.ts`, `Filters.ts`, `CartDrawer.ts`, `ProductModal.ts`.
    - `src/services/`: `whatsapp.ts`, `storage.ts`.
    - `src/main.ts`: Punto de entrada y orquestador de la aplicación.
  - `dist/`: Código JavaScript compilado nativo en ES2022 para el navegador.
  - `products.json`: Catálogo de 65 productos con enlaces a imágenes reales de Google Drive vía CDN.
  - `style.css`: Estilos compilados con Tailwind 3.4 (no modificar directamente; compilar desde `input.css`).
  - `input.css`: Fuentes CSS, animaciones 3D personalizadas y diseño cinético.
  - `tailwind.config.js`: Tokens de diseño y safelist de clases.
  - `lucide.min.js`: Iconografía local offline.
  - `MEMORY.md`: Registro exhaustivo de la historia, decisiones de diseño y catálogo de Drive.

## 2. Reglas de Desarrollo
1. **No usar CDNs externos que puedan bloquearse:** El proyecto fue rediseñado expresamente para funcionar 100% de manera local y evitar bloqueos como el error 403 de Tailwind Play CDN.
2. **Compilación de TypeScript:** Al modificar archivos en `src/`, compilar con:
   ```bash
   npm run build:ts
   # o en modo observador continuo:
   npm run watch:ts
   ```
3. **Si agregas nuevas clases CSS dinámicas:** Asegúrate de agregarlas a `safelist` en `tailwind.config.js` y recompilar con:
   ```bash
   npm run build:css
   # o compilar todo (CSS + TS):
   npm run build
   ```
4. **Imágenes de Google Drive:** Se sirven mediante `https://lh3.googleusercontent.com/d/{ID}=w800`.
5. **Servidor Local de Desarrollo:** Se corre habitualmente en el puerto 5500 con Python:
   ```bash
   python -m http.server 5500
   ```

## 3. Estado Actual
El diseño está 100% operativo con Hero 3D cinético interactivo, arquitectura modular en TypeScript, búsqueda en tiempo real, filtros por marca/género/talla, carrito lateral deslizable, modal de vista rápida y compras vía WhatsApp.
