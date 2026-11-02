# 🛒 TechNova Web Store — Aplicación Web Interactiva (`PRAI 3: Actividad Final`)

Proyecto final integrador del curso **Desarrollo Web II (IC05)**. Consiste en una aplicación web de comercio electrónico desarrollada con **HTML5, CSS3 y JavaScript (ES6+)** que integra manipulación dinámica del DOM, validación de formularios en tiempo real con expresiones regulares, persistencia de datos en `localStorage`, control de versiones con ramas en **Git/GitHub** y publicación web activa.

---

## 👥 Integrantes del Equipo

- **Jesús Contreras**
- **Lysney Simancas Segovia**

---

## 🌐 Aplicación Publicada en Vivo

- **Sitio desplegado (GitHub Pages):** https://darkdavidm.github.io/carrito-compras/
- **Repositorio en GitHub:** https://github.com/Darkdavidm/carrito-compras

---

## ✨ Funcionalidades Integradas por Módulo

### 1. JavaScript e Interfaz de Usuario (Módulos 01 y 02)
- **Modo Claro / Oscuro persistente:** Alternancia dinámica con `classList.toggle('dark-mode')` recordando la preferencia del usuario en `localStorage`.
- **Menú Responsive para móviles:** Apertura y cierre dinámico del panel de navegación en pantallas pequeñas.
- **Buscador en tiempo real y filtros por categoría:** Filtrado instantáneo del catálogo de productos (*Todos*, *Periféricos*, *Audio*, *Accesorios*) actualizando el contador de resultados en el DOM.
- **Carrito de compras interactivo:**
  - Captura de datos mediante atributos `data-id`, `data-nombre` y `data-precio`.
  - Renderizado dinámico de nodos (`document.createElement` / `appendChild`).
  - Control de cantidades (`+` / `−`), cálculo automático de subtotales y total a pagar, eliminación individual, vaciado del carrito y finalización de compra con generación de folio de pedido.

### 2. Formularios, Validaciones y Almacenamiento Local (Módulo 03)
- **Registro e Inicio de Sesión de Clientes (`novalidate` + JS):**
  - Función validadora reutilizable (`validarCampo`) con retroalimentación visual en tiempo real (`input` y `blur`), bordes de estado (`.valido` / `.invalido`) y mensajes descriptivos en etiquetas `<small class="error">`.
  - Validación con **expresiones regulares (`RegExp`)** para nombre completo, número celular de 10 dígitos y formato de correo electrónico, además de longitud mínima de contraseña (8 caracteres) y coincidencia de confirmación de contraseña.
- **Persistencia por usuario en `localStorage`:** Cada cliente registrado conserva de forma independiente su sesión activa, su carrito de compras y su historial de pedidos realizados.

### 3. Control de Versiones y Publicación Web (Módulo 04)
- Flujo de trabajo con **Git** utilizando ramas de funcionalidades (`feature/validacion-formularios`, `feature/catalogo-interactivo-prai3`) integradas a la rama principal `main`.
- Despliegue continuo en línea a través de **GitHub Pages**.

---

## 📂 Estructura del Proyecto

```text
carrito_compras/
├── index.html      # Estructura semántica de autenticación, catálogo, carrito e historial
├── css/
│   └── style.css   # Estilos responsive, variables visuales, modo oscuro y estados de validación
├── js/
│   └── app.js      # Lógica de validación reutilizable, sesiones, filtros DOM, carrito y pedidos
└── README.md       # Documentación del proyecto final
```
