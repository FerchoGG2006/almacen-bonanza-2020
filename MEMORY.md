# MEMORIA DEL PROYECTO: BONANZA 2020 (E-COMMERCE)

> **Archivo de Memoria Persistente para el Agente y el Entorno de Desarrollo**  
> **Fecha de Creación/Actualización:** 15 de Septiembre de 2026  
> **Ubicación del Proyecto:** `C:\Users\ASUS\almacen-bonanza-2020`  
> **Servidor Local Activo:** `http://localhost:5500/`  

---

## 1. Identidad del Negocio y Propósito
- **Nombre:** Bonanza 2020
- **Tienda Física:** Calle 16B # 7A-55 Barrio Centro, Valledupar, Cesar, Colombia
- **Teléfono Oficial / WhatsApp:** +57 316 7675967 (`573167675967`)
- **Email Corporativo:** `bonanza.2020.22@gmail.com`
- **Nicho de Mercado:** Sneakers urbanos, calzado deportivo de alto rendimiento (Running, Gym, Casual, Retro) y streetwear/ropa deportiva (conjuntos de microfibra, camisetas de fútbol retro, joggers y bermudas).
- **Modelo de Venta:** 
  - Atención y venta directa en local físico en el centro de Valledupar.
  - Venta local en Valledupar con **Entrega Inmediata y Pago Contra Entrega** (en efectivo o transferencia Nequi/Daviplata/Bancolombia al recibir el paquete).
  - Envíos nacionales asegurados a toda Colombia vía Servientrega o Interrapidísimo.
  - Cierre de ventas y atención personalizada por **WhatsApp**.

---

## 2. Decisiones de Diseño y Evolución Crítica
1. **Descarte de la Maqueta Inicial 3D ("Gamer/Cyberpunk"):**
   - La primera versión (`gemini-code-1789497762021.html`) utilizaba fondo negro absoluto, colores neón y Three.js con un modelo 3D interactivo.
   - **Razón del rechazo:** En un e-commerce real para Colombia, los clientes compran desde el móvil. Three.js bloqueaba el scroll, aumentaba los tiempos de carga, consumía batería y no permitía ver la mercancía real.
2. **Adopción del Estilo "Kinetic Editorial Streetwear":**
   - Inspirado en las mejores tiendas de calzado mundial (*Nike SNKRS, Kith, Solebox, Foot Locker*).
   - Fondo limpio en blanco roto y grafito de alto contraste (`#FAFAFA` y `#0B0C10`), permitiendo que el color real de las fotos de los tenis sea el protagonista.
   - Tipografía editorial potente (*Syne* y *Plus Jakarta Sans*).
3. **Resolución del Bug de Estilos (Error 403 Forbidden de Tailwind CDN):**
   - Inicialmente la web usaba `cdn.tailwindcss.com`, el cual fue bloqueado por Cloudflare con error HTTP 403 Forbidden, mostrando solo el esqueleto HTML sin estilos.
   - **Solución implementada:** Se compiló un archivo CSS local e independiente [`style.css`](style.css) de 360 KB con Tailwind CLI y se descargó [`lucide.min.js`](lucide.min.js) de forma local. La web ahora es 100% autónoma y no depende de servidores externos.
4. **Hero Dinámico 3D Cinético:**
   - Se transformó la sección Hero para corregir el desbordamiento de texto en pantallas medianas/laptops y eliminar la tarjeta estática cerrada.
   - Se implementó una **Arena 3D Flotante** donde el calzado levita en gravedad cero (`@keyframes floatSneaker3D`), con sombra de suelo reactiva (`@keyframes shadowPulse3D`), seguimiento de perspectiva 3D interactivo con el cursor del ratón, selector de ángulo ("Giro 3D"), badges de especificaciones en capas de profundidad Z y selector directo entre las siluetas top (Nike SB Dunk, Jordan 4, Dunk Panda, New Balance 9060).


---

## 3. Arquitectura del Catálogo y Conexión con Google Drive
El inventario del almacén está alojado en una carpeta pública de Google Drive:
- **Carpeta Raíz del Catálogo:** `1WPNkUu0kynpaT7ZGco1StC3wudAmgEiD` (`CATALOGO BONANZA2020`)
- **Estructura de Subcarpetas extraídas:**
  - `CALZADO HOMBRE`: `1-4st1rZywPBWP3568xToIwS09Q3ZtSFz`
    - Subcarpetas por marca: Nike (`10H1PKzsuYCxM7rlexrtfvedS3d-VqAEs`), Adidas (`10HIy_laJpwj6Coq5Sv-hxpA6dUIKoQ8y`), New Balance (`15Z99jByiOY9g4lHIvci20TomJvvKyf7F`), On Cloud (`11s3LuEAOv__mK0MPoS6Ja151EZhRlS1y`), Asics (`10Ncak27cq5ZPn9yFWydtRxyDt5zrq0x9`), Puma (`1ik7oP-VL6yt9veK1BnS_KlrfS78SknvI`), etc.
  - `CALZADO MUJER`: `1--lUBTcifMew2xdKW2h9UHUH9fmBbkbT`
    - Subcarpetas: Nike (`1-HAcw56-p1aBHWgdlogSaGgD6AChmy4n`), Adidas (`1-Q8WaXY-ekdHZpAPQ8bQVXJB8iOSvYXW`), On Cloud (`1sZUi2QEdDJgo6bdev4kMIAv7Z1bVW_Wp`), etc.
  - `ROPA HOMBRE`: `1-BaVPludS1PsYGXhADaWPzjzEMYxROap`
    - Conjuntos Deportivos (`1uTfEyr-76izm3Z-CBHwnNjswVmeEftzH`), Suéters Deportivos (`18HXvC5qb9hLOT4iWTR_lQ2WWfnlY7MoP`), Camisetas de Fútbol (`1RVi28uZ71Q-qKoQyyYnQjylnF5x9c5Nc`), Bermudas (`1CHvQ3Vbdnn9vImBbEzOS7M7HlqFmodlW`), etc.
  - `CALZADO DE NIÑO`: `1eZgcgcvsv5-SQO8bLWVPkUn-g3lYC4u7`
- **Estrategia CDN de Imágenes:**
  - Cada archivo de Drive se consume directamente mediante: `https://lh3.googleusercontent.com/d/{ID}=w800`.
  - Carga inmediata, respuesta 200 OK y alta resolución sin saturar el almacenamiento del servidor local.
- **Base de Datos Local del Catálogo:**
  - Generada en [`products.json`](products.json) con **65 referencias activas**, precios reales en pesos colombianos ($COP), tallas colombianas (37 a 43 y S a XL) y doble imagen (ángulo principal y hover).

---

## 4. Funcionalidades Clave de la Tienda
1. **Marquee Superior Continuo:** Destaca pagos contra entrega en Valledupar, envíos nacionales y garantía.
2. **Buscador Instantáneo:** Búsqueda en vivo por marca, modelo o colorway con botón de borrado rápido.
3. **Filtros Dinámicos:**
   - Por Categoría: *Todos, Zapatillas, Running & Training, Conjuntos Deportivos, Ropa & Camisetas*.
   - Por Género: *Todos, Hombre, Mujer*.
   - Por Marca: *Nike, Adidas, New Balance, On Cloud, Asics, Puma, Bonanza Sport, Fútbol Club*.
   - Por Talla: *37, 38, 39, 40, 41, 42, 43, S, M, L, XL*.
4. **Tarjetas de Producto de Alta Conversión:**
   - Efecto hover con transición suave al segundo ángulo / suela del zapato.
   - **Selector de talla directo en la tarjeta:** Permite elegir la talla antes de tocar el botón de compra.
   - Botón directo "Comprar por WhatsApp" con mensaje formateado.
   - Botón secundario "Añadir al Carrito".
5. **Slide-Over Cart (Carrito Lateral Deslizable):**
   - Muestra productos agregados con selector de cantidad (+/-) y talla.
   - Formulario de datos de entrega del cliente (Nombre y Dirección/Ciudad).
   - Genera el pedido consolidado estructurado para WhatsApp.
6. **Modal de Vista Rápida (Quick View):**
   - Alternancia entre fotos de alta resolución, guía de tallas colombianas y garantía de cambio de talla.
7. **Botón Flotante de WhatsApp:** Con efecto pulso esmeralda para atención inmediata.

---

## 5. Estructura de Archivos del Proyecto
```
C:\Users\ASUS\almacen-bonanza-2020\
├── index.html           # Aplicación completa con interfaz de usuario y lógica
├── products.json        # Base de datos JSON con 65 referencias y enlaces Drive CDN
├── style.css            # Hoja de estilos completa compilada con Tailwind 3.4 (360 KB)
├── input.css            # Fuente CSS con animaciones personalizadas y directivas Tailwind
├── tailwind.config.js   # Configuración de diseño, tokens de color y safelist
├── lucide.min.js        # Librería de iconos vectoriales offline (439 KB)
├── README.md            # Documentación del proyecto y guía de ejecución
├── AGENTS.md            # Directrices de contexto para asistentes de IA en nuevas sesiones
└── MEMORY.md            # Este archivo de memoria viva del proyecto
```

---

## 6. Próximos Pasos Sugeridos para la Siguiente Sesión
1. **Número Oficial de WhatsApp:** Cambiar el placeholder `573000000000` en `index.html` por la línea real de atención del almacén.
2. **Pasarela de Pagos (Opcional):** Integrar botón de pago directo con Nequi / Daviplata o pasarela colombiana (Wompi, Bold, ePayco).
3. **Panel de Administración o Google Sheets Sync:** Conectar un script para que al subir nuevas fotos a Drive o editar un Google Sheets, se actualice `products.json` automáticamente.
4. **Despliegue a Producción:** Subir a Vercel, Netlify o GitHub Pages con dominio propio (ej. `almacenbonanza2020.com`).
