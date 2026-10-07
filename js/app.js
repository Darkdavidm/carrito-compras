const btnTheme = document.getElementById('btn-theme');
const body = document.body;

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        btnTheme.textContent = 'Modo Claro';
    } else {
        btnTheme.textContent = 'Modo Oscuro';
    }
});

let carrito = [];
const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('btn-vaciar');

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

    carrito.push(producto);

    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = '';

    let total = 0;

    carrito.forEach((producto, index) => {
        // Crear contenedor para el item
        const divItem = document.createElement('div');
        divItem.classList.add('item-carrito');

        const pInfo = document.createElement('p');
        pInfo.textContent = `${producto.nombre} - $${producto.precio}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.textContent = 'Eliminar';
        
        btnEliminar.addEventListener('click', () => {
            eliminarProducto(index);
        });

        divItem.appendChild(pInfo);
        divItem.appendChild(btnEliminar);

        listaCarrito.appendChild(divItem);

        total += producto.precio;
    });

    contenedorTotal.textContent = total;
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

btnVaciar.addEventListener('click', () => {
    carrito = [];
    renderizarCarrito();
});
