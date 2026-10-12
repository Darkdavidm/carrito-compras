const btnTheme = document.getElementById('btn-theme');
const body = document.body;

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    btnTheme.textContent = body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
});

const seccionAuth = document.getElementById('seccion-auth');
const seccionTienda = document.getElementById('seccion-tienda');
const userHeaderInfo = document.getElementById('user-header-info');
const userName = document.getElementById('user-name');
const userDatos = document.getElementById('user-datos');
const btnLogout = document.getElementById('btn-logout');

const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const authMensaje = document.getElementById('auth-mensaje');
const btnAutofill = document.getElementById('btn-autofill');

const usuarioDefault = {
    id: 1,
    nombre: "Jesús Contreras",
    telefono: "3028348399",
    email: "jdcontrerast@gmail.com",
    direccion: "Avenida falsa 123",
    password: "123",
    carrito: [
        { id: "1", nombre: "Producto A", precio: 10 }
    ]
};

let usuarios = JSON.parse(localStorage.getItem('tienda_usuarios')) || [];

const existeJesus = usuarios.find(u => u.email === usuarioDefault.email);
if (!existeJesus) {
    usuarios.unshift(usuarioDefault);
    localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));
} else {
    if (!existeJesus.telefono) existeJesus.telefono = usuarioDefault.telefono;
    if (!existeJesus.direccion) existeJesus.direccion = usuarioDefault.direccion;
    localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));
}

let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;

if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
        document.getElementById('login-email').value = usuarioDefault.email;
        document.getElementById('login-password').value = usuarioDefault.password;
    });
}

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('activo');
    tabRegistro.classList.remove('activo');
    formLogin.classList.remove('oculto');
    formRegistro.classList.add('oculto');
    limpiarMensaje();
});

tabRegistro.addEventListener('click', () => {
    tabRegistro.classList.add('activo');
    tabLogin.classList.remove('activo');
    formRegistro.classList.remove('oculto');
    formLogin.classList.add('oculto');
    limpiarMensaje();
});

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const direccion = document.getElementById('reg-direccion').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        mostrarMensaje('Este correo ya está registrado. Inicia sesión.', 'error');
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        telefono: telefono,
        direccion: direccion,
        email: email,
        password: password,
        carrito: []
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    mostrarMensaje('¡Cuenta creada con éxito! Ya puedes iniciar sesión.', 'exito');
    formRegistro.reset();

    setTimeout(() => {
        tabLogin.click();
        document.getElementById('login-email').value = email;
    }, 1200);
});

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (!usuarioEncontrado) {
        mostrarMensaje('Correo o contraseña incorrectos.', 'error');
        return;
    }

    iniciarSesion(usuarioEncontrado);
});

function iniciarSesion(usuario) {
    usuarioActivo = usuario;
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));

    // Cambiar vista: ocultar login, mostrar tienda
    seccionAuth.classList.add('oculto');
    seccionTienda.classList.remove('oculto');
    userHeaderInfo.classList.remove('oculto');

    userName.textContent = usuarioActivo.nombre;
    userDatos.textContent = `📞 ${usuarioActivo.telefono || 'Sin teléfono'} | 📧 ${usuarioActivo.email} | 📍 ${usuarioActivo.direccion || 'Sin dirección'}`;

    limpiarMensaje();
    formLogin.reset();

    renderizarCarrito();
}

btnLogout.addEventListener('click', () => {
    usuarioActivo = null;
    localStorage.removeItem('tienda_usuario_activo');

    seccionTienda.classList.add('oculto');
    userHeaderInfo.classList.add('oculto');
    seccionAuth.classList.remove('oculto');

    tabLogin.click();
});

function guardarUsuarios() {
    localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));
}

function mostrarMensaje(texto, tipo) {
    authMensaje.textContent = texto;
    authMensaje.className = `mensaje-${tipo}`;
}

function limpiarMensaje() {
    authMensaje.textContent = '';
    authMensaje.className = '';
}

const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('btn-vaciar');

const botonesAgregar = document.querySelectorAll('.btn-agregar');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

function agregarAlCarrito(e) {
    e.preventDefault();
    if (!usuarioActivo) return;

    const boton = e.target;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    const producto = { id, nombre, precio };

    if (!usuarioActivo.carrito) {
        usuarioActivo.carrito = [];
    }
    usuarioActivo.carrito.push(producto);

    sincronizarUsuarioActivo();
    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    if (!usuarioActivo || !usuarioActivo.carrito || usuarioActivo.carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        contenedorTotal.textContent = '0';
        return;
    }

    usuarioActivo.carrito.forEach((producto, index) => {
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
    if (!usuarioActivo) return;
    usuarioActivo.carrito.splice(index, 1);
    sincronizarUsuarioActivo();
    renderizarCarrito();
}

btnVaciar.addEventListener('click', () => {
    if (!usuarioActivo) return;
    usuarioActivo.carrito = [];
    sincronizarUsuarioActivo();
    renderizarCarrito();
});

function sincronizarUsuarioActivo() {
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
    const index = usuarios.findIndex(u => u.id === usuarioActivo.id);
    if (index !== -1) {
        usuarios[index] = usuarioActivo;
        guardarUsuarios();
    }
}

if (usuarioActivo) {
    iniciarSesion(usuarioActivo);
}
