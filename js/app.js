// --- 1. Modo Claro / Oscuro ---
const btnTheme = document.getElementById('btn-theme');
const body = document.body;

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Cambiar texto del botón
    if (body.classList.contains('dark-mode')) {
        btnTheme.textContent = 'Modo Claro';
    } else {
        btnTheme.textContent = 'Modo Oscuro';
    }
});

// --- 2. Carrito de Compras Básico ---
let carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('btn-vaciar');

// Capturar botones de "Agregar"
const botonesAgregar = document.querySelectorAll('.btn-agregar');

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

function agregarAlCarrito(e) {
    // Evitar comportamiento por defecto si fuera un enlace o form
    e.preventDefault();

    // Obtener los datos del botón (data-attributes)
    const boton = e.target;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    // Crear un objeto producto
    const producto = {
        id: id,
        nombre: nombre,
        precio: precio
    };

    // Agregar al arreglo del carrito
    carrito.push(producto);

    // Actualizar la interfaz del carrito
    renderizarCarrito();
}

function renderizarCarrito() {
    // 1. Limpiar el HTML del carrito previo
    listaCarrito.innerHTML = '';

    let total = 0;

    // 2. Recorrer el carrito y crear los nodos dinámicamente
    carrito.forEach((producto, index) => {
        // Crear contenedor para el item
        const divItem = document.createElement('div');
        divItem.classList.add('item-carrito');

        // Crear texto del producto
        const pInfo = document.createElement('p');
        pInfo.textContent = `${producto.nombre} - $${producto.precio}`;

        // Crear botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.textContent = 'Eliminar';
        
        // Asignar evento para eliminar (pasamos el index para saber cuál borrar)
        btnEliminar.addEventListener('click', () => {
            eliminarProducto(index);
        });

        // Ensamblar los nodos
        divItem.appendChild(pInfo);
        divItem.appendChild(btnEliminar);

        // Agregar el item al contenedor principal del carrito
        listaCarrito.appendChild(divItem);

        // Sumar al total
        total += producto.precio;
    });

    // 3. Actualizar el total en pantalla
    contenedorTotal.textContent = total;
}

function eliminarProducto(index) {
    // Eliminar el elemento del arreglo usando su índice
    carrito.splice(index, 1);
    // Volver a renderizar
    renderizarCarrito();
}

// Vaciar carrito
btnVaciar.addEventListener('click', () => {
    carrito = [];
    renderizarCarrito();
});
