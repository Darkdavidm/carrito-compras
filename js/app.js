// ==============================================================
// 1. TEMA CLARO / OSCURO
// ==============================================================
const btnTheme = document.getElementById('btn-theme');
const body = document.body;

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    btnTheme.textContent = body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
});


// ==============================================================
// 2. SISTEMA DE AUTENTICACIÓN Y USUARIOS
// ==============================================================
// Elementos de la interfaz
const seccionAuth = document.getElementById('seccion-auth');
const seccionTienda = document.getElementById('seccion-tienda');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const btnLogout = document.getElementById('btn-logout');

const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const authMensaje = document.getElementById('auth-mensaje');

// Almacenamiento en LocalStorage
// Estructura de cada usuario: { id, nombre, email, password, carrito: [] }
let usuarios = JSON.parse(localStorage.getItem('tienda_usuarios')) || [];
let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;

// Alternar entre pestañas de Login y Registro
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

// Evento: Registro de nuevo usuario
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    // Verificar si el correo ya está registrado
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        mostrarMensaje('Este correo ya está registrado. Inicia sesión.', 'error');
        return;
    }

    // Crear nuevo usuario con su carrito personal vacío
    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        password: password,
        carrito: []
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    mostrarMensaje('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.', 'exito');
    formRegistro.reset();

    // Cambiar a la pestaña de login automáticamente
    setTimeout(() => {
        tabLogin.click();
    }, 1500);
});

// Evento: Iniciar sesión
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    // Buscar coincidencia de credenciales
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (!usuarioEncontrado) {
        mostrarMensaje('Correo o contraseña incorrectos.', 'error');
        return;
    }

    // Iniciar sesión
    iniciarSesion(usuarioEncontrado);
});

// Función para iniciar sesión y mostrar la tienda
function iniciarSesion(usuario) {
    usuarioActivo = usuario;
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));

    // Cambiar de pantalla: ocultar login, mostrar tienda
    seccionAuth.classList.add('oculto');
    seccionTienda.classList.remove('oculto');
    userInfo.classList.remove('oculto');
    btnLogout.classList.remove('oculto');
    userName.textContent = usuarioActivo.nombre;

    limpiarMensaje();
    formLogin.reset();

    // Renderizar el carrito personal de este usuario
    renderizarCarrito();
}

// Evento: Cerrar sesión
btnLogout.addEventListener('click', () => {
    usuarioActivo = null;
    localStorage.removeItem('tienda_usuario_activo');

    // Volver a la pantalla de login
    seccionTienda.classList.add('oculto');
    userInfo.classList.add('oculto');
    btnLogout.classList.add('oculto');
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


// ==============================================================
// 3. MÓDULO DE CARRITO DE COMPRAS PERSONALIZADO POR USUARIO
// ==============================================================
const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('btn-vaciar');

// Capturar botones de "Agregar al Carrito"
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

    // Agregar al carrito exclusivo del usuario activo
    if (!usuarioActivo.carrito) {
        usuarioActivo.carrito = [];
    }
    usuarioActivo.carrito.push(producto);

    // Guardar cambios en el almacenamiento persistente
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

// Guardar los cambios del usuario activo en la lista general de usuarios
function sincronizarUsuarioActivo() {
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
    const index = usuarios.findIndex(u => u.id === usuarioActivo.id);
    if (index !== -1) {
        usuarios[index] = usuarioActivo;
        guardarUsuarios();
    }
}


// ==============================================================
// 4. INICIALIZACIÓN: COMPROBAR SI YA HABÍA SESIÓN INICIADA
// ==============================================================
if (usuarioActivo) {
    iniciarSesion(usuarioActivo);
}
