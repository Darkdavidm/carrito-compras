# 🛒 TechNova Web Store — Aplicación Web Interactiva (`PRAI 3: Actividad Final`)

Proyecto final integrador del curso **Desarrollo Web II (IC05)**. Consiste en una aplicación web de comercio electrónico con separación de roles (**Administrador** y **Cliente**), desarrollada con **HTML5, CSS3 y JavaScript (ES6+)** que integra manipulación dinámica del DOM, gestión completa de catálogo (productos, precios, categorías e imágenes reales), administración de usuarios y restablecimiento de contraseñas, validación de formularios en tiempo real con expresiones regulares, persistencia en `localStorage`, control de versiones con ramas en **Git/GitHub** y publicación web activa.

---

## 👥 Integrantes del Equipo

- **Lysney Simancas Segovia**
- **Jesús Contreras**

---

## 🌐 Aplicación Publicada en Vivo

- **Sitio desplegado (GitHub Pages):** https://darkdavidm.github.io/carrito-compras/
- **Repositorio en GitHub:** https://github.com/Darkdavidm/carrito-compras

---

## ✨ Arquitectura Funcional por Rol

### 👑 Rol Administrador (`Consola de Administración`)
El administrador cuenta con su propia interfaz de gestión empresarial (sin carrito de compras), dividida en dos módulos:
1. **📦 Gestión de Productos y Categorías:**
   - Creación y eliminación segura de **categorías** (los filtros de la tienda del cliente se actualizan automáticamente).
   - Creación, edición y eliminación de **productos** controlando nombre, descripción, **precio**, **categoría** e **imágenes reales** (permite tanto **subir fotos desde la PC** optimizándolas automáticamente en `<canvas>` como enlazar una **URL externa**, con vista previa instantánea).
2. **👥 Gestión de Usuarios y Contraseñas:**
   - Directorio con buscador en tiempo real por nombre, correo o teléfono.
   - Edición validada de datos personales y rol (`Cliente` / `Administrador`).
   - Restablecimiento de contraseñas en caso de olvido.

### 👤 Rol Cliente (`Tienda Online y Carrito`)
- Catálogo dinámico con **fotografías reales de productos**, buscador en tiempo real y filtros dinámicos por categoría.
- Carrito de compras interactivo (`data-id`, `data-nombre`, `data-precio`) con ajuste de cantidades (`+` / `−`), cálculo automático de subtotales/total, vaciado y confirmación de compras con registro en **Mis Pedidos Realizados** dentro de `localStorage`.
- Modo Claro / Oscuro persistente y navegación responsive para dispositivos móviles.

---

## 📂 Estructura del Proyecto

```text
carrito_compras/
├── index.html      # Estructura semántica: acceso, vista cliente y consola administrador
├── css/
│   └── style.css   # Estilos responsive, tarjetas con imagen real, modo oscuro y consola admin
├── img/            # Fotografías reales de los productos iniciales del catálogo
├── js/
│   └── app.js      # Lógica de roles, inventario, compresión de imágenes, usuarios y carrito
└── README.md       # Documentación del proyecto final
```
