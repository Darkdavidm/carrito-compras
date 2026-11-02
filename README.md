# Mi Tienda Web - Actividad Final (PRAI 3)

Proyecto final del curso **Desarrollo Web II (IC05)**. Aplicación web interactiva desarrollada con HTML5, CSS3 y JavaScript para la gestión de inventario, administración de usuarios y compras en línea con almacenamiento en `localStorage`.

## Integrantes

- Lysney Simancas Segovia
- Jesús Contreras

## Enlaces

- Sitio publicado (GitHub Pages): https://darkdavidm.github.io/carrito-compras/
- Repositorio en GitHub: https://github.com/Darkdavidm/carrito-compras

## Funcionalidades Principales

### Panel de Administración (Rol Administrador)
- Gestión de categorías de productos (creación y eliminación validando productos asociados).
- Administración del catálogo de productos: registro, edición de precios, descripciones, categorías y carga de imágenes desde el equipo o mediante URL.
- Directorio de usuarios registrados con búsqueda en tiempo real, edición de datos personales, cambio de rol y restablecimiento de contraseñas olvidadas.

### Tienda en Línea (Rol Cliente)
- Registro e inicio de sesión con validaciones en tiempo real mediante expresiones regulares.
- Catálogo dinámico con fotografías de productos, buscador por texto y filtros por categoría.
- Carrito de compras por usuario con control de cantidades, cálculo automático de totales, vaciado y registro de historial de pedidos en `localStorage`.
- Tema claro/oscuro persistente y diseño adaptable a dispositivos móviles.

## Estructura de Archivos

- `index.html`: Estructura principal de las vistas de acceso, tienda y administración.
- `css/style.css`: Estilos generales, diseño responsive y modo oscuro.
- `js/app.js`: Validaciones, manejo del DOM, sesiones por rol, inventario y carrito.
- `img/`: Imágenes de los productos del catálogo inicial.
