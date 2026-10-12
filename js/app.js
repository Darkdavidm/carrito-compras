// ==========================================
// 1. Modo Claro / Oscuro
// ==========================================
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


// ==========================================
// 2. Módulo de Registro de Clientes / Usuarios
// ==========================================
const formRegistro = document.getElementById('form-registro');
const listaClientes = document.getElementById('lista-clientes');
const mensajeRegistro = document.getElementById('mensaje-registro');

// Cargar clientes desde localStorage o iniciar con un arreglo vacío
let clientes = JSON.parse(localStorage.getItem('clientes_tienda')) || [];

// Capturar el evento de envío del formulario
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // Capturar valores de los campos
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const direccion = document.getElementById('reg-direccion').value.trim();

    // Validar campos vacíos
    if (!nombre || !email || !telefono || !direccion) {
        mostrarMensaje('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }

    // Crear el objeto del nuevo cliente
    const nuevoCliente = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        telefono: telefono,
        direccion: direccion
    };

    // Agregar al arreglo
    clientes.push(nuevoCliente);

    // Guardar en localStorage y actualizar la vista en el DOM
    guardarYRenderizarClientes();

    // Notificar al usuario y limpiar el formulario
    mostrarMensaje('¡Cliente registrado con éxito!', 'exito');
    formRegistro.reset();
});

// Función para guardar en localStorage y volver a renderizar
function guardarYRenderizarClientes() {
    localStorage.setItem('clientes_tienda', JSON.stringify(clientes));
    renderizarClientes();
}

// Renderizado dinámico de clientes en el DOM
function renderizarClientes() {
    listaClientes.innerHTML = '';

    if (clientes.length === 0) {
        const sinClientes = document.createElement('p');
        sinClientes.className = 'sin-clientes';
        sinClientes.textContent = 'No hay clientes registrados.';
        listaClientes.appendChild(sinClientes);
        return;
    }

    clientes.forEach((cliente, index) => {
        // Crear contenedor para cada cliente
        const divCliente = document.createElement('div');
        divCliente.className = 'item-cliente';

        // Crear contenedor con información del cliente
        const info = document.createElement('div');
        info.innerHTML = `<strong>${cliente.nombre}</strong><small>📧 ${cliente.email} | 📞 ${cliente.telefono} | 📍 ${cliente.direccion}</small>`;

        // Crear botón para eliminar cliente
        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-cliente';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            eliminarCliente(index);
        });

        // Ensamblar nodos
        divCliente.appendChild(info);
        divCliente.appendChild(btnEliminar);

        listaClientes.appendChild(divCliente);
    });
}

// Función para eliminar un cliente por su índice
function eliminarCliente(index) {
    clientes.splice(index, 1);
    guardarYRenderizarClientes();
    mostrarMensaje('Cliente eliminado correctamente.', 'info');
}

// Mostrar mensajes de alerta temporales
function mostrarMensaje(texto, tipo) {
    mensajeRegistro.textContent = texto;
    mensajeRegistro.className = `mensaje-${tipo}`;
    
    setTimeout(() => {
        mensajeRegistro.textContent = '';
        mensajeRegistro.className = '';
    }, 3000);
}

// Renderizar clientes almacenados al cargar la página
renderizarClientes();


// ==========================================
// 3. Módulo de Carrito de Compras Básico
// ==========================================
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
    e.preventDefault();

    // Obtener los datos del botón (data-attributes)
    const boton = e.target;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

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

// Vaciar carrito
btnVaciar.addEventListener('click', () => {
    carrito = [];
    renderizarCarrito();
});
