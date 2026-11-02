// =========================================================================
// 1. INTERFAZ: MODO CLARO / OSCURO (CON PERSISTENCIA) Y MENÚ RESPONSIVE
// =========================================================================
const btnTheme = document.getElementById('btn-theme');
const btnMenu = document.getElementById('btn-menu');
const navPanel = document.getElementById('nav-panel');
const body = document.body;

function aplicarTema(modoOscuro) {
    body.classList.toggle('dark-mode', modoOscuro);
    btnTheme.textContent = modoOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
}

const temaGuardado = localStorage.getItem('tienda_tema') === 'oscuro';
aplicarTema(temaGuardado);

btnTheme.addEventListener('click', () => {
    const activo = !body.classList.contains('dark-mode');
    aplicarTema(activo);
    localStorage.setItem('tienda_tema', activo ? 'oscuro' : 'claro');
});

if (btnMenu && navPanel) {
    btnMenu.addEventListener('click', () => {
        navPanel.classList.toggle('abierto');
    });
}

// =========================================================================
// 2. REFERENCIAS DEL DOM Y USUARIOS INICIALES EN LOCALSTORAGE
// =========================================================================
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
const btnAutofillJesus = document.getElementById('btn-autofill-jesus');
const btnAutofillLysney = document.getElementById('btn-autofill-lysney');

// Expresiones regulares para validación del lado del cliente
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^\d{10}$/;
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;

const usuariosDemo = [
    {
        id: 1,
        nombre: "Jesús Contreras",
        telefono: "3028348399",
        email: "jdcontrerast@gmail.com",
        direccion: "Avenida Principal 123",
        password: "Demo12345",
        carrito: [
            { id: "1", nombre: "Audífonos Bluetooth ANC", precio: 85, cantidad: 1 }
        ],
        pedidos: []
    },
    {
        id: 2,
        nombre: "Lysney Simancas Segovia",
        telefono: "3015557890",
        email: "lysney.simancas@correo.com",
        direccion: "Calle 45 # 12-30",
        password: "Demo12345",
        carrito: [
            { id: "2", nombre: "Teclado Mecánico RGB", precio: 120, cantidad: 1 }
        ],
        pedidos: []
    }
];

function normalizarCarrito(carrito = []) {
    const mapa = new Map();
    carrito.forEach((item) => {
        const id = String(item.id);
        const cantidad = Number(item.cantidad) > 0 ? Number(item.cantidad) : 1;
        const precio = Number(item.precio) || 0;
        if (mapa.has(id)) {
            mapa.get(id).cantidad += cantidad;
        } else {
            mapa.set(id, {
                id,
                nombre: item.nombre === 'Producto A' ? 'Audífonos Bluetooth ANC' : item.nombre,
                precio: item.nombre === 'Producto A' ? 85 : precio,
                cantidad
            });
        }
    });
    return Array.from(mapa.values());
}

let usuarios = JSON.parse(localStorage.getItem('tienda_usuarios')) || [];

usuariosDemo.forEach((demo) => {
    const existente = usuarios.find(u => u.email === demo.email);
    if (!existente) {
        usuarios.push({ ...demo });
    } else {
        if (!existente.telefono) existente.telefono = demo.telefono;
        if (!existente.direccion) existente.direccion = demo.direccion;
        if (existente.password === '123') existente.password = demo.password;
        existente.carrito = normalizarCarrito(existente.carrito);
        if (!Array.isArray(existente.pedidos)) existente.pedidos = [];
    }
});

usuarios = usuarios.map(u => ({
    ...u,
    carrito: normalizarCarrito(u.carrito),
    pedidos: Array.isArray(u.pedidos) ? u.pedidos : []
}));
localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));

let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;
if (usuarioActivo) {
    const actualizado = usuarios.find(u => u.email === usuarioActivo.email);
    usuarioActivo = actualizado || {
        ...usuarioActivo,
        carrito: normalizarCarrito(usuarioActivo.carrito),
        pedidos: Array.isArray(usuarioActivo.pedidos) ? usuarioActivo.pedidos : []
    };
}

// =========================================================================
// 3. FUNCIONES REUTILIZABLES DE VALIDACIÓN DE FORMULARIOS (TIEMPO REAL)
// =========================================================================
function mostrarError(campo, mensaje, elementoError) {
    campo.classList.add('invalido');
    campo.classList.remove('valido');
    if (elementoError) {
        elementoError.textContent = mensaje;
    }
}

function marcarValido(campo, elementoError) {
    campo.classList.remove('invalido');
    campo.classList.add('valido');
    if (elementoError) {
        elementoError.textContent = '';
    }
}

function limpiarEstadoFormulario(formulario) {
    const campos = formulario.querySelectorAll('input');
    const errores = formulario.querySelectorAll('small.error');
    campos.forEach(campo => campo.classList.remove('valido', 'invalido'));
    errores.forEach(error => { error.textContent = ''; });
}

function validarCampo(regla) {
    const campo = document.getElementById(regla.id);
    const elementoError = document.getElementById(regla.errorId);
    const valor = regla.sinTrim ? campo.value : campo.value.trim();

    if (regla.requerido && valor === '') {
        mostrarError(campo, regla.mensajeVacio || 'Este campo es obligatorio.', elementoError);
        return false;
    }

    if (regla.minLength && valor.length < regla.minLength) {
        mostrarError(campo, `Debe contener al menos ${regla.minLength} caracteres.`, elementoError);
        return false;
    }

    if (regla.regex && !regla.regex.test(valor)) {
        mostrarError(campo, regla.mensajeRegex, elementoError);
        return false;
    }

    if (regla.coincideConId) {
        const campoOriginal = document.getElementById(regla.coincideConId);
        if (valor !== campoOriginal.value) {
            mostrarError(campo, regla.mensajeCoincidencia || 'Los valores no coinciden.', elementoError);
            return false;
        }
    }

    marcarValido(campo, elementoError);
    return true;
}

const reglasLogin = [
    {
        id: 'login-email',
        errorId: 'error-login-email',
        requerido: true,
        mensajeVacio: 'Ingresa tu correo electrónico.',
        regex: REGEX_EMAIL,
        mensajeRegex: 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).'
    },
    {
        id: 'login-password',
        errorId: 'error-login-password',
        requerido: true,
        sinTrim: true,
        mensajeVacio: 'Ingresa tu contraseña.'
    }
];

const reglasRegistro = [
    {
        id: 'reg-nombre',
        errorId: 'error-reg-nombre',
        requerido: true,
        mensajeVacio: 'El nombre completo es obligatorio.',
        regex: REGEX_NOMBRE,
        mensajeRegex: 'Ingresa un nombre válido (solo letras y espacios, mínimo 3 caracteres).'
    },
    {
        id: 'reg-telefono',
        errorId: 'error-reg-telefono',
        requerido: true,
        mensajeVacio: 'El número de teléfono es obligatorio.',
        regex: REGEX_TELEFONO,
        mensajeRegex: 'Ingresa un número celular válido de 10 dígitos numéricos.'
    },
    {
        id: 'reg-direccion',
        errorId: 'error-reg-direccion',
        requerido: true,
        minLength: 5,
        mensajeVacio: 'La dirección de envío es obligatoria.'
    },
    {
        id: 'reg-email',
        errorId: 'error-reg-email',
        requerido: true,
        mensajeVacio: 'El correo electrónico es obligatorio.',
        regex: REGEX_EMAIL,
        mensajeRegex: 'Formato de correo inválido (ej. nombre@correo.com).'
    },
    {
        id: 'reg-password',
        errorId: 'error-reg-password',
        requerido: true,
        sinTrim: true,
        minLength: 8,
        mensajeVacio: 'Debes definir una contraseña.'
    },
    {
        id: 'reg-confirmar',
        errorId: 'error-reg-confirmar',
        requerido: true,
        sinTrim: true,
        mensajeVacio: 'Confirma tu contraseña.',
        coincideConId: 'reg-password',
        mensajeCoincidencia: 'Las contraseñas no coinciden.'
    }
];

[...reglasLogin, ...reglasRegistro].forEach((regla) => {
    const campo = document.getElementById(regla.id);
    if (!campo) return;

    campo.addEventListener('input', () => {
        validarCampo(regla);
        if (regla.id === 'reg-password') {
            const confirmarInput = document.getElementById('reg-confirmar');
            if (confirmarInput && confirmarInput.value !== '') {
                validarCampo(reglasRegistro.find(r => r.id === 'reg-confirmar'));
            }
        }
    });

    campo.addEventListener('blur', () => validarCampo(regla));
});

// =========================================================================
// 4. AUTENTICACIÓN, REGISTRO Y SESIÓN DE CLIENTES
// =========================================================================
function rellenarDemo(emailDemo) {
    const usuario = usuarios.find(u => u.email === emailDemo);
    if (!usuario) return;
    document.getElementById('login-email').value = usuario.email;
    document.getElementById('login-password').value = usuario.password;
    reglasLogin.forEach(regla => validarCampo(regla));
    mostrarMensaje(`Cuenta demo de ${usuario.nombre} lista. Haz clic en Ingresar.`, 'exito');
}

if (btnAutofillJesus) {
    btnAutofillJesus.addEventListener('click', () => rellenarDemo('jdcontrerast@gmail.com'));
}

if (btnAutofillLysney) {
    btnAutofillLysney.addEventListener('click', () => rellenarDemo('lysney.simancas@correo.com'));
}

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('activo');
    tabRegistro.classList.remove('activo');
    formLogin.classList.remove('oculto');
    formRegistro.classList.add('oculto');
    limpiarEstadoFormulario(formRegistro);
    limpiarMensaje();
});

tabRegistro.addEventListener('click', () => {
    tabRegistro.classList.add('activo');
    tabLogin.classList.remove('activo');
    formRegistro.classList.remove('oculto');
    formLogin.classList.add('oculto');
    limpiarEstadoFormulario(formLogin);
    limpiarMensaje();
});

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const formularioValido = reglasRegistro.map(regla => validarCampo(regla)).every(Boolean);
    if (!formularioValido) {
        mostrarMensaje('Por favor corrige los campos marcados en rojo.', 'error');
        return;
    }

    const nombre = document.getElementById('reg-nombre').value.trim();
    const telefono = document.getElementById('reg-telefono').value.trim();
    const direccion = document.getElementById('reg-direccion').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        mostrarError(
            document.getElementById('reg-email'),
            'Este correo ya se encuentra registrado.',
            document.getElementById('error-reg-email')
        );
        mostrarMensaje('Este correo ya está registrado. Inicia sesión.', 'error');
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        telefono,
        direccion,
        email,
        password,
        carrito: [],
        pedidos: []
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();

    mostrarMensaje('¡Cuenta creada con éxito! Redirigiendo a inicio de sesión...', 'exito');
    formRegistro.reset();
    limpiarEstadoFormulario(formRegistro);

    setTimeout(() => {
        tabLogin.click();
        const loginEmail = document.getElementById('login-email');
        loginEmail.value = email;
        validarCampo(reglasLogin[0]);
    }, 1100);
});

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const formularioValido = reglasLogin.map(regla => validarCampo(regla)).every(Boolean);
    if (!formularioValido) {
        mostrarMensaje('Revisa los datos ingresados antes de continuar.', 'error');
        return;
    }

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

    seccionAuth.classList.add('oculto');
    seccionTienda.classList.remove('oculto');
    userHeaderInfo.classList.remove('oculto');

    userName.textContent = usuarioActivo.nombre;
    userDatos.textContent = `📞 ${usuarioActivo.telefono || 'Sin teléfono'} | 📧 ${usuarioActivo.email} | 📍 ${usuarioActivo.direccion || 'Sin dirección'}`;

    limpiarMensaje();
    limpiarMensajeCarrito();
    formLogin.reset();
    limpiarEstadoFormulario(formLogin);

    renderizarCarrito();
    renderizarPedidos();
}

btnLogout.addEventListener('click', () => {
    usuarioActivo = null;
    localStorage.removeItem('tienda_usuario_activo');

    seccionTienda.classList.add('oculto');
    userHeaderInfo.classList.add('oculto');
    seccionAuth.classList.remove('oculto');
    if (navPanel) navPanel.classList.remove('abierto');

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

// =========================================================================
// 5. BÚSQUEDA Y FILTRADO INTERACTIVO DEL CATÁLOGO (DOM EN TIEMPO REAL)
// =========================================================================
const inputBuscar = document.getElementById('input-buscar');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const tarjetasProducto = document.querySelectorAll('.producto');
const contadorResultados = document.getElementById('contador-resultados');
const sinResultados = document.getElementById('sin-resultados');

let categoriaSeleccionada = 'todos';

function filtrarCatalogo() {
    const termino = (inputBuscar ? inputBuscar.value : '').trim().toLowerCase();
    let visibles = 0;

    tarjetasProducto.forEach((tarjeta) => {
        const categoria = tarjeta.getAttribute('data-categoria');
        const textoTarjeta = tarjeta.textContent.toLowerCase();

        const coincideCategoria = categoriaSeleccionada === 'todos' || categoria === categoriaSeleccionada;
        const coincideBusqueda = termino === '' || textoTarjeta.includes(termino);

        if (coincideCategoria && coincideBusqueda) {
            tarjeta.classList.remove('oculto');
            visibles++;
        } else {
            tarjeta.classList.add('oculto');
        }
    });

    if (contadorResultados) {
        contadorResultados.textContent = `Mostrando ${visibles} producto${visibles === 1 ? '' : 's'}`;
    }

    if (sinResultados) {
        sinResultados.classList.toggle('oculto', visibles > 0);
    }
}

if (inputBuscar) {
    inputBuscar.addEventListener('input', filtrarCatalogo);
}

botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        categoriaSeleccionada = boton.getAttribute('data-filtro');
        filtrarCatalogo();
    });
});

// =========================================================================
// 6. CARRITO DE COMPRAS DINÁMICO Y FINALIZACIÓN DE PEDIDOS
// =========================================================================
const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const cantidadTotalItems = document.getElementById('cantidad-total-items');
const headerContadorCarrito = document.getElementById('header-contador-carrito');
const btnVaciar = document.getElementById('btn-vaciar');
const btnComprar = document.getElementById('btn-comprar');
const carritoMensaje = document.getElementById('carrito-mensaje');
const listaPedidos = document.getElementById('lista-pedidos');

const botonesAgregar = document.querySelectorAll('.btn-agregar');
botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', agregarAlCarrito);
});

function mostrarMensajeCarrito(texto, tipo) {
    if (!carritoMensaje) return;
    carritoMensaje.textContent = texto;
    carritoMensaje.className = `carrito-mensaje mensaje-${tipo}`;
}

function limpiarMensajeCarrito() {
    if (!carritoMensaje) return;
    carritoMensaje.textContent = '';
    carritoMensaje.className = 'carrito-mensaje';
}

function agregarAlCarrito(e) {
    e.preventDefault();
    if (!usuarioActivo) return;

    const boton = e.currentTarget;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    if (!Array.isArray(usuarioActivo.carrito)) {
        usuarioActivo.carrito = [];
    }

    const existente = usuarioActivo.carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        usuarioActivo.carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    sincronizarUsuarioActivo();
    renderizarCarrito();
    mostrarMensajeCarrito(`✓ "${nombre}" agregado al carrito.`, 'exito');
}

function cambiarCantidad(id, cambio) {
    if (!usuarioActivo || !Array.isArray(usuarioActivo.carrito)) return;
    const index = usuarioActivo.carrito.findIndex(item => item.id === id);
    if (index === -1) return;

    usuarioActivo.carrito[index].cantidad += cambio;
    if (usuarioActivo.carrito[index].cantidad <= 0) {
        usuarioActivo.carrito.splice(index, 1);
    }

    limpiarMensajeCarrito();
    sincronizarUsuarioActivo();
    renderizarCarrito();
}

function eliminarProducto(id) {
    if (!usuarioActivo || !Array.isArray(usuarioActivo.carrito)) return;
    usuarioActivo.carrito = usuarioActivo.carrito.filter(item => item.id !== id);
    limpiarMensajeCarrito();
    sincronizarUsuarioActivo();
    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = '';
    let totalPrecio = 0;
    let totalArticulos = 0;

    if (!usuarioActivo || !usuarioActivo.carrito || usuarioActivo.carrito.length === 0) {
        const pVacio = document.createElement('p');
        pVacio.classList.add('carrito-vacio');
        pVacio.textContent = 'Tu carrito está vacío.';
        listaCarrito.appendChild(pVacio);

        contenedorTotal.textContent = '0';
        if (cantidadTotalItems) cantidadTotalItems.textContent = '0';
        if (headerContadorCarrito) headerContadorCarrito.textContent = '0';
        return;
    }

    usuarioActivo.carrito.forEach((producto) => {
        const cantidad = producto.cantidad || 1;
        const subtotal = producto.precio * cantidad;
        totalPrecio += subtotal;
        totalArticulos += cantidad;

        const divItem = document.createElement('div');
        divItem.classList.add('item-carrito');

        const divInfo = document.createElement('div');
        divInfo.classList.add('item-info');

        const pNombre = document.createElement('p');
        pNombre.classList.add('item-nombre');
        pNombre.textContent = producto.nombre;

        const pSubtotal = document.createElement('p');
        pSubtotal.classList.add('item-subtotal');
        pSubtotal.textContent = `$${producto.precio} x ${cantidad} = $${subtotal}`;

        divInfo.appendChild(pNombre);
        divInfo.appendChild(pSubtotal);

        const divControles = document.createElement('div');
        divControles.classList.add('item-controles');

        const btnMenos = document.createElement('button');
        btnMenos.type = 'button';
        btnMenos.classList.add('btn-cantidad');
        btnMenos.textContent = '−';
        btnMenos.addEventListener('click', () => cambiarCantidad(producto.id, -1));

        const spanCantidad = document.createElement('span');
        spanCantidad.classList.add('cantidad-valor');
        spanCantidad.textContent = String(cantidad);

        const btnMas = document.createElement('button');
        btnMas.type = 'button';
        btnMas.classList.add('btn-cantidad');
        btnMas.textContent = '+';
        btnMas.addEventListener('click', () => cambiarCantidad(producto.id, 1));

        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarProducto(producto.id));

        divControles.appendChild(btnMenos);
        divControles.appendChild(spanCantidad);
        divControles.appendChild(btnMas);
        divControles.appendChild(btnEliminar);

        divItem.appendChild(divInfo);
        divItem.appendChild(divControles);
        listaCarrito.appendChild(divItem);
    });

    contenedorTotal.textContent = totalPrecio;
    if (cantidadTotalItems) cantidadTotalItems.textContent = String(totalArticulos);
    if (headerContadorCarrito) headerContadorCarrito.textContent = String(totalArticulos);
}

btnVaciar.addEventListener('click', () => {
    if (!usuarioActivo) return;
    usuarioActivo.carrito = [];
    sincronizarUsuarioActivo();
    renderizarCarrito();
    mostrarMensajeCarrito('Carrito vaciado correctamente.', 'error');
});

if (btnComprar) {
    btnComprar.addEventListener('click', () => {
        if (!usuarioActivo || !usuarioActivo.carrito || usuarioActivo.carrito.length === 0) {
            mostrarMensajeCarrito('Agrega al menos un producto antes de finalizar la compra.', 'error');
            return;
        }

        const totalPedido = usuarioActivo.carrito.reduce(
            (acc, item) => acc + item.precio * (item.cantidad || 1),
            0
        );
        const resumenProductos = usuarioActivo.carrito
            .map(item => `${item.nombre} (x${item.cantidad || 1})`)
            .join(', ');

        const nuevoPedido = {
            folio: `PED-${Date.now().toString().slice(-5)}`,
            fecha: new Date().toLocaleString('es-CO'),
            resumen: resumenProductos,
            total: totalPedido,
            direccion: usuarioActivo.direccion
        };

        if (!Array.isArray(usuarioActivo.pedidos)) {
            usuarioActivo.pedidos = [];
        }
        usuarioActivo.pedidos.unshift(nuevoPedido);
        usuarioActivo.carrito = [];

        sincronizarUsuarioActivo();
        renderizarCarrito();
        renderizarPedidos();
        mostrarMensajeCarrito(`🎉 ¡Compra ${nuevoPedido.folio} confirmada por $${totalPedido}!`, 'exito');
    });
}

function renderizarPedidos() {
    if (!listaPedidos) return;
    listaPedidos.innerHTML = '';

    if (!usuarioActivo || !Array.isArray(usuarioActivo.pedidos) || usuarioActivo.pedidos.length === 0) {
        const pSinPedidos = document.createElement('p');
        pSinPedidos.classList.add('carrito-vacio');
        pSinPedidos.textContent = 'Aún no has registrado compras. Agrega productos al carrito y pulsa "Finalizar Compra".';
        listaPedidos.appendChild(pSinPedidos);
        return;
    }

    usuarioActivo.pedidos.forEach((pedido) => {
        const card = document.createElement('div');
        card.classList.add('pedido-card');

        const encabezado = document.createElement('div');
        encabezado.classList.add('pedido-encabezado');

        const spanFolio = document.createElement('span');
        spanFolio.textContent = `Orden ${pedido.folio} — ${pedido.fecha}`;

        const spanTotal = document.createElement('span');
        spanTotal.textContent = `Total: $${pedido.total}`;

        encabezado.appendChild(spanFolio);
        encabezado.appendChild(spanTotal);

        const pDetalle = document.createElement('p');
        pDetalle.classList.add('pedido-detalle');
        pDetalle.textContent = `Productos: ${pedido.resumen} | Envío a: ${pedido.direccion}`;

        card.appendChild(encabezado);
        card.appendChild(pDetalle);
        listaPedidos.appendChild(card);
    });
}

function sincronizarUsuarioActivo() {
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
    const index = usuarios.findIndex(u => u.id === usuarioActivo.id || u.email === usuarioActivo.email);
    if (index !== -1) {
        usuarios[index] = usuarioActivo;
        guardarUsuarios();
    }
}

if (usuarioActivo) {
    iniciarSesion(usuarioActivo);
}
