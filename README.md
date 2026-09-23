# BONANZA 2020 · TIENDA OFICIAL & E-COMMERCE

Plataforma de comercio electrónico para **Bonanza 2020** (Valledupar, Cesar, Colombia), especializada en calzado deportivo, sneakers de colección y ropa deportiva urbana.

## Características Principales
- ⚡ **Diseño Editorial Streetwear:** Interfaz ultrarrápida, limpia y con 60 FPS garantizados sin dependencias pesadas.
- 👟 **Catálogo Real Conectado a Google Drive:** Más de 65 referencias activas de marcas líderes (Nike, Jordan, Adidas, New Balance, On Cloud, Asics, Puma) con fotos reales alojadas en la nube.
- 📱 **Checkout Híbrido WhatsApp + Carrito:** Los clientes pueden pedir en 1 solo clic con la talla y modelo seleccionados o llenar su carrito y despachar el pedido formalizado a WhatsApp.
- 🔍 **Buscador & Filtros Vivos:** Filtra al instante por Marca, Talla (37-43 / S-XL), Género (Hombre/Mujer) o Categoría (Zapatillas, Running, Conjuntos, Camisetas).
- 📦 **Enfoque en el Mercado Colombiano:** Preparado para Pagos Contra Entrega en Valledupar y despachos nacionales por Servientrega / Interrapidísimo.
- 🔒 **100% Autónomo:** Estilos CSS compilados y recursos locales para garantizar cero fallos por bloqueos de red o servidores externos.

## Cómo Abrir y Ejecutar el Proyecto

### Opción 1: Servidor Local (Recomendado)
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
python -m http.server 5500
```
Luego abre tu navegador en:
**http://localhost:5500/**

### Opción 2: Abrir Directamente
Haz doble clic sobre el archivo `index.html` en el explorador de Windows.

## Estructura del Código
- `index.html` - Interfaz completa y lógica de estado del carrito, filtros y modales.
- `products.json` - Base de datos de productos con imágenes CDN de Google Drive.
- `style.css` - Estilos Tailwind CSS compilados de forma nativa (360 KB).
- `input.css` - Archivo fuente de estilos y animaciones para recompilar con Tailwind CLI.
- `lucide.min.js` - Librería de iconos vectoriales offline.
- `MEMORY.md` - Memoria persistente del proyecto con todo el historial de desarrollo.
- `AGENTS.md` - Contexto y directrices para asistentes de IA.
