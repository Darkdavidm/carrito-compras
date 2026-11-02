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
// 2. REFERENCIAS DEL DOM Y USUARIOS INICIALES EN LOCALSTORAGE (ROLES)
// =========================================================================
const seccionAuth = document.getElementById('seccion-auth');
const seccionTienda = document.getElementById('seccion-tienda');
const seccionAdmin = document.getElementById('seccion-admin');
const userHeaderInfo = document.getElementById('user-header-info');
const userName = document.getElementById('user-name');
const userRolBadge = document.getElementById('user-rol-badge');
const userDatos = document.getElementById('user-datos');
const adminNavSwitch = document.getElementById('admin-nav-switch');
const btnVistaTienda = document.getElementById('btn-vista-tienda');
const btnVistaAdmin = document.getElementById('btn-vista-admin');
const btnVolverTienda = document.getElementById('btn-volver-tienda');
const btnLogout = document.getElementById('btn-logout');

const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const authMensaje = document.getElementById('auth-mensaje');
const btnAutofillLysney = document.getElementById('btn-autofill-lysney');
const btnAutofillJesus = document.getElementById('btn-autofill-jesus');
const btnOlvidoClave = document.getElementById('btn-olvido-clave');

// Expresiones regulares para validación del lado del cliente
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^\d{10}$/;
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;

// Cuentas iniciales: Lysney Simancas Segovia (Administradora) y Jesús Contreras (Cliente)
const usuariosDemo = [
    {
        id: 2,
        nombre: "Lysney Simancas Segovia",
        telefono: "3015557890",
        email: "lysney.simancas@correo.com",
        direccion: "Calle 45 # 12-30",
        password: "Demo12345",
        rol: "admin",
        carrito: [
            { id: "2", nombre: "Teclado Mecánico RGB", precio: 120, cantidad: 1 }
        ],
        pedidos: []
    },
    {
        id: 1,
        nombre: "Jesús Contreras",
        telefono: "3028348399",
        email: "jdcontrerast@gmail.com",
        direccion: "Avenida Principal 123",
        password: "Demo12345",
        rol: "cliente",
        carrito: [
            { id: "1", nombre: "Audífonos Bluetooth ANC", precio: 85, cantidad: 1 }
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
        if (demo.email === 'lysney.simancas@correo.com' && !existente.rol) {
            existente.rol = 'admin';
        }
        if (!existente.rol) existente.rol = demo.rol;
        existente.carrito = normalizarCarrito(existente.carrito);
        if (!Array.isArray(existente.pedidos)) existente.pedidos = [];
    }
});

// Garantizar que exista al menos un administrador y que Lysney aparezca primero en el directorio
if (!usuarios.some(u => u.rol === 'admin')) {
    const cuentaLysney = usuarios.find(u => u.email === 'lysney.simancas@correo.com');
    if (cuentaLysney) {
        cuentaLysney.rol = 'admin';
    } else if (usuarios.length > 0) {
        usuarios[0].rol = 'admin';
    }
}

usuarios = usuarios
    .map(u => ({
        ...u,
        rol: u.rol || 'cliente',
        carrito: normalizarCarrito(u.carrito),
        pedidos: Array.isArray(u.pedidos) ? u.pedidos : []
    }))
    .sort((a, b) => {
        if (a.email === 'lysney.simancas@correo.com') return -1;
        if (b.email === 'lysney.simancas@correo.com') return 1;
        return 0;
    });

localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));

let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;
if (usuarioActivo) {
    const actualizado = usuarios.find(u => u.id === usuarioActivo.id || u.email === usuarioActivo.email);
    usuarioActivo = actualizado || null;
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
    if (!formulario) return;
    const campos = formulario.querySelectorAll('input');
    const errores = formulario.querySelectorAll('small.error');
    campos.forEach(campo => campo.classList.remove('valido', 'invalido'));
    errores.forEach(error => { error.textContent = ''; });
}

function validarCampo(regla) {
    const campo = document.getElementById(regla.id);
    const elementoError = document.getElementById(regla.errorId);
    if (!campo) return true;

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
        if (campoOriginal && valor !== campoOriginal.value) {
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

const reglasAdminEditar = [
    {
        id: 'admin-edit-nombre',
        errorId: 'error-admin-edit-nombre',
        requerido: true,
        mensajeVacio: 'El nombre no puede quedar vacío.',
        regex: REGEX_NOMBRE,
        mensajeRegex: 'Usa solo letras y espacios (mínimo 3 caracteres).'
    },
    {
        id: 'admin-edit-telefono',
        errorId: 'error-admin-edit-telefono',
        requerido: true,
        mensajeVacio: 'El teléfono es obligatorio.',
        regex: REGEX_TELEFONO,
        mensajeRegex: 'Debe contener exactamente 10 dígitos numéricos.'
    },
    {
        id: 'admin-edit-direccion',
        errorId: 'error-admin-edit-direccion',
        requerido: true,
        minLength: 5,
        mensajeVacio: 'La dirección es obligatoria.'
    },
    {
        id: 'admin-edit-email',
        errorId: 'error-admin-edit-email',
        requerido: true,
        mensajeVacio: 'El correo es obligatorio.',
        regex: REGEX_EMAIL,
        mensajeRegex: 'Formato de correo electrónico inválido.'
    }
];

const reglasAdminPassword = [
    {
        id: 'admin-nueva-password',
        errorId: 'error-admin-nueva-password',
        requerido: true,
        sinTrim: true,
        minLength: 8,
        mensajeVacio: 'Escribe la nueva contraseña.'
    },
    {
        id: 'admin-confirmar-password',
        errorId: 'error-admin-confirmar-password',
        requerido: true,
        sinTrim: true,
        mensajeVacio: 'Confirma la nueva contraseña.',
        coincideConId: 'admin-nueva-password',
        mensajeCoincidencia: 'Las contraseñas no coinciden.'
    }
];

function registrarValidacionTiempoReal(listaReglas, idPasswordPrincipal, idConfirmacion) {
    listaReglas.forEach((regla) => {
        const campo = document.getElementById(regla.id);
        if (!campo) return;

        campo.addEventListener('input', () => {
            validarCampo(regla);
            if (idPasswordPrincipal && regla.id === idPasswordPrincipal) {
                const confirmarInput = document.getElementById(idConfirmacion);
                if (confirmarInput && confirmarInput.value !== '') {
                    validarCampo(listaReglas.find(r => r.id === idConfirmacion));
                }
            }
        });

        campo.addEventListener('blur', () => validarCampo(regla));
    });
}

registrarValidacionTiempoReal(reglasLogin);
registrarValidacionTiempoReal(reglasRegistro, 'reg-password', 'reg-confirmar');
registrarValidacionTiempoReal(reglasAdminEditar);
registrarValidacionTiempoReal(reglasAdminPassword, 'admin-nueva-password', 'admin-confirmar-password');

// =========================================================================
// 4. AUTENTICACIÓN, REGISTRO, ROLES Y NAVEGACIÓN ENTRE VISTAS
// =========================================================================
function rellenarDemo(emailDemo) {
    const usuario = usuarios.find(u => u.email === emailDemo);
    if (!usuario) return;
    document.getElementById('login-email').value = usuario.email;
    document.getElementById('login-password').value = usuario.password;
    reglasLogin.forEach(regla => validarCampo(regla));
    const etiquetaRol = usuario.rol === 'admin' ? 'Administradora' : 'Cliente';
    mostrarMensaje(`Cuenta demo de ${usuario.nombre} (${etiquetaRol}) cargada. Pulsa Ingresar.`, 'exito');
}

if (btnAutofillLysney) {
    btnAutofillLysney.addEventListener('click', () => rellenarDemo('lysney.simancas@correo.com'));
}

if (btnAutofillJesus) {
    btnAutofillJesus.addEventListener('click', () => rellenarDemo('jdcontrerast@gmail.com'));
}

if (btnOlvidoClave) {
    btnOlvidoClave.addEventListener('click', () => {
        mostrarMensaje(
            '🔑 Si olvidaste tu clave, solicita a un Administrador (ej. Lysney Simancas) restablecerla desde "Administrar Usuarios".',
            'exito'
        );
    });
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
        rol: 'cliente',
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
        mostrarMensaje('Correo o contraseña incorrectos. Si la olvidaste, un Administrador puede restablecerla.', 'error');
        return;
    }

    iniciarSesion(usuarioEncontrado);
});

function actualizarEncabezadoUsuario() {
    if (!usuarioActivo) return;

    userName.textContent = usuarioActivo.nombre;
    const esAdmin = usuarioActivo.rol === 'admin';

    if (userRolBadge) {
        userRolBadge.textContent = esAdmin ? '👑 Admin' : '👤 Cliente';
        userRolBadge.classList.toggle('es-admin', esAdmin);
    }

    if (adminNavSwitch) {
        adminNavSwitch.classList.toggle('oculto', !esAdmin);
    }

    userDatos.textContent = `📞 ${usuarioActivo.telefono || 'Sin teléfono'} | 📧 ${usuarioActivo.email} | 📍 ${usuarioActivo.direccion || 'Sin dirección'}`;
}

function cambiarVistaActiva(vista) {
    if (!usuarioActivo) return;
    const mostrarAdmin = vista === 'admin' && usuarioActivo.rol === 'admin';

    seccionTienda.classList.toggle('oculto', mostrarAdmin);
    seccionAdmin.classList.toggle('oculto', !mostrarAdmin);

    if (btnVistaTienda && btnVistaAdmin) {
        btnVistaTienda.classList.toggle('activo', !mostrarAdmin);
        btnVistaAdmin.classList.toggle('activo', mostrarAdmin);
    }

    if (mostrarAdmin) {
        cerrarFormulariosAdmin();
        limpiarFeedbackAdmin();
        renderizarPanelAdmin();
    }
}

if (btnVistaTienda) {
    btnVistaTienda.addEventListener('click', () => cambiarVistaActiva('tienda'));
}

if (btnVistaAdmin) {
    btnVistaAdmin.addEventListener('click', () => cambiarVistaActiva('admin'));
}

if (btnVolverTienda) {
    btnVolverTienda.addEventListener('click', () => cambiarVistaActiva('tienda'));
}

function iniciarSesion(usuario) {
    usuarioActivo = usuario;
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));

    seccionAuth.classList.add('oculto');
    userHeaderInfo.classList.remove('oculto');

    actualizarEncabezadoUsuario();
    cambiarVistaActiva('tienda');

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
    seccionAdmin.classList.add('oculto');
    userHeaderInfo.classList.add('oculto');
    seccionAuth.classList.remove('oculto');
    if (navPanel) navPanel.classList.remove('abierto');

    cerrarFormulariosAdmin();
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

// =========================================================================
// 7. PANEL DE ADMINISTRACIÓN DE USUARIOS (EDICIÓN DE DATOS Y CLAVES)
// =========================================================================
const kpiTotalUsuarios = document.getElementById('kpi-total-usuarios');
const kpiTotalAdmins = document.getElementById('kpi-total-admins');
const kpiTotalPedidos = document.getElementById('kpi-total-pedidos');
const contadorUsuariosAdmin = document.getElementById('contador-usuarios-admin');
const inputBuscarUsuario = document.getElementById('input-buscar-usuario');
const listaUsuariosAdmin = document.getElementById('lista-usuarios-admin');
const adminListaMensaje = document.getElementById('admin-lista-mensaje');

const adminPanelVacio = document.getElementById('admin-panel-vacio');
const cardAdminEditar = document.getElementById('card-admin-editar');
const cardAdminPassword = document.getElementById('card-admin-password');
const formAdminEditar = document.getElementById('form-admin-editar');
const formAdminPassword = document.getElementById('form-admin-password');
const btnCancelarEditar = document.getElementById('btn-cancelar-editar');
const btnCancelarPassword = document.getElementById('btn-cancelar-password');
const checkVerClaveAdmin = document.getElementById('check-ver-clave-admin');
const adminPassUsuarioInfo = document.getElementById('admin-pass-usuario-info');

function mostrarFeedbackAdmin(texto, tipo) {
    if (!adminListaMensaje) return;
    adminListaMensaje.textContent = texto;
    adminListaMensaje.className = `admin-feedback mensaje-${tipo}`;
}

function limpiarFeedbackAdmin() {
    if (!adminListaMensaje) return;
    adminListaMensaje.textContent = '';
    adminListaMensaje.className = 'admin-feedback';
}

function cerrarFormulariosAdmin() {
    if (cardAdminEditar) cardAdminEditar.classList.add('oculto');
    if (cardAdminPassword) cardAdminPassword.classList.add('oculto');
    if (adminPanelVacio) adminPanelVacio.classList.remove('oculto');
    if (formAdminEditar) {
        formAdminEditar.reset();
        limpiarEstadoFormulario(formAdminEditar);
    }
    if (formAdminPassword) {
        formAdminPassword.reset();
        limpiarEstadoFormulario(formAdminPassword);
    }
    if (checkVerClaveAdmin) {
        checkVerClaveAdmin.checked = false;
        alternarVisibilidadClaveAdmin(false);
    }
}

function alternarVisibilidadClaveAdmin(mostrar) {
    const tipo = mostrar ? 'text' : 'password';
    const inputNueva = document.getElementById('admin-nueva-password');
    const inputConfirmar = document.getElementById('admin-confirmar-password');
    if (inputNueva) inputNueva.type = tipo;
    if (inputConfirmar) inputConfirmar.type = tipo;
}

if (checkVerClaveAdmin) {
    checkVerClaveAdmin.addEventListener('change', (e) => {
        alternarVisibilidadClaveAdmin(e.target.checked);
    });
}

if (btnCancelarEditar) {
    btnCancelarEditar.addEventListener('click', cerrarFormulariosAdmin);
}

if (btnCancelarPassword) {
    btnCancelarPassword.addEventListener('click', cerrarFormulariosAdmin);
}

function actualizarKPIsAdmin() {
    const totalAdmins = usuarios.filter(u => u.rol === 'admin').length;
    const totalPedidosSistema = usuarios.reduce(
        (acc, u) => acc + (Array.isArray(u.pedidos) ? u.pedidos.length : 0),
        0
    );

    if (kpiTotalUsuarios) kpiTotalUsuarios.textContent = String(usuarios.length);
    if (kpiTotalAdmins) kpiTotalAdmins.textContent = String(totalAdmins);
    if (kpiTotalPedidos) kpiTotalPedidos.textContent = String(totalPedidosSistema);
}

function abrirEdicionUsuario(idUsuario) {
    const usuario = usuarios.find(u => String(u.id) === String(idUsuario));
    if (!usuario) return;

    cerrarFormulariosAdmin();
    adminPanelVacio.classList.add('oculto');
    cardAdminEditar.classList.remove('oculto');

    document.getElementById('admin-edit-id').value = String(usuario.id);
    document.getElementById('admin-edit-nombre').value = usuario.nombre || '';
    document.getElementById('admin-edit-telefono').value = usuario.telefono || '';
    document.getElementById('admin-edit-direccion').value = usuario.direccion || '';
    document.getElementById('admin-edit-email').value = usuario.email || '';
    document.getElementById('admin-edit-rol').value = usuario.rol || 'cliente';

    reglasAdminEditar.forEach(regla => validarCampo(regla));
}

function abrirCambioPasswordUsuario(idUsuario) {
    const usuario = usuarios.find(u => String(u.id) === String(idUsuario));
    if (!usuario) return;

    cerrarFormulariosAdmin();
    adminPanelVacio.classList.add('oculto');
    cardAdminPassword.classList.remove('oculto');

    document.getElementById('admin-pass-id').value = String(usuario.id);
    if (adminPassUsuarioInfo) {
        adminPassUsuarioInfo.textContent = `Asignando nueva contraseña para: ${usuario.nombre} (${usuario.email})`;
    }
}

function eliminarUsuarioPorAdmin(idUsuario) {
    if (!usuarioActivo || usuarioActivo.rol !== 'admin') return;
    if (String(usuarioActivo.id) === String(idUsuario)) {
        mostrarFeedbackAdmin('No puedes eliminar tu propia cuenta con la sesión abierta.', 'error');
        return;
    }

    const index = usuarios.findIndex(u => String(u.id) === String(idUsuario));
    if (index === -1) return;

    const eliminado = usuarios[index];
    usuarios.splice(index, 1);
    guardarUsuarios();
    cerrarFormulariosAdmin();
    renderizarPanelAdmin();
    mostrarFeedbackAdmin(`✓ La cuenta de "${eliminado.nombre}" fue eliminada correctamente.`, 'exito');
}

function renderizarPanelAdmin() {
    if (!listaUsuariosAdmin) return;
    actualizarKPIsAdmin();

    const termino = (inputBuscarUsuario ? inputBuscarUsuario.value : '').trim().toLowerCase();
    const filtrados = usuarios.filter((u) => {
        if (termino === '') return true;
        return (
            (u.nombre || '').toLowerCase().includes(termino) ||
            (u.email || '').toLowerCase().includes(termino) ||
            (u.telefono || '').toLowerCase().includes(termino)
        );
    });

    if (contadorUsuariosAdmin) {
        contadorUsuariosAdmin.textContent = `${filtrados.length} cuenta${filtrados.length === 1 ? '' : 's'}`;
    }

    listaUsuariosAdmin.innerHTML = '';

    if (filtrados.length === 0) {
        const pVacio = document.createElement('p');
        pVacio.classList.add('carrito-vacio');
        pVacio.textContent = 'No se encontraron usuarios con ese criterio.';
        listaUsuariosAdmin.appendChild(pVacio);
        return;
    }

    filtrados.forEach((u) => {
        const card = document.createElement('div');
        card.classList.add('usuario-admin-card');

        const divInfo = document.createElement('div');
        divInfo.classList.add('usuario-admin-info');

        const divTitulo = document.createElement('div');
        divTitulo.classList.add('usuario-admin-titulo');

        const spanNombre = document.createElement('span');
        spanNombre.textContent = u.nombre;

        const spanRol = document.createElement('span');
        const esAdmin = u.rol === 'admin';
        spanRol.className = `tag-rol ${esAdmin ? 'tag-rol-admin' : 'tag-rol-cliente'}`;
        spanRol.textContent = esAdmin ? '👑 Administrador' : '👤 Cliente';

        divTitulo.appendChild(spanNombre);
        divTitulo.appendChild(spanRol);

        const pMeta1 = document.createElement('p');
        pMeta1.classList.add('usuario-admin-meta');
        pMeta1.textContent = `📧 ${u.email} | 📞 ${u.telefono || 'Sin teléfono'}`;

        const pMeta2 = document.createElement('p');
        pMeta2.classList.add('usuario-admin-meta');
        const numPedidos = Array.isArray(u.pedidos) ? u.pedidos.length : 0;
        pMeta2.textContent = `📍 ${u.direccion || 'Sin dirección'} | 📦 Pedidos: ${numPedidos}`;

        divInfo.appendChild(divTitulo);
        divInfo.appendChild(pMeta1);
        divInfo.appendChild(pMeta2);

        const divBotones = document.createElement('div');
        divBotones.classList.add('usuario-admin-botones');

        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.classList.add('btn-editar-usr');
        btnEditar.textContent = '✏️ Editar Datos';
        btnEditar.addEventListener('click', () => abrirEdicionUsuario(u.id));

        const btnClave = document.createElement('button');
        btnClave.type = 'button';
        btnClave.classList.add('btn-clave-usr');
        btnClave.textContent = '🔑 Cambiar Clave';
        btnClave.addEventListener('click', () => abrirCambioPasswordUsuario(u.id));

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.classList.add('btn-borrar-usr');
        btnBorrar.textContent = '🗑️ Eliminar';
        if (usuarioActivo && String(usuarioActivo.id) === String(u.id)) {
            btnBorrar.disabled = true;
            btnBorrar.title = 'Tu sesión actual está activa';
        } else {
            btnBorrar.addEventListener('click', () => eliminarUsuarioPorAdmin(u.id));
        }

        divBotones.appendChild(btnEditar);
        divBotones.appendChild(btnClave);
        divBotones.appendChild(btnBorrar);

        card.appendChild(divInfo);
        card.appendChild(divBotones);
        listaUsuariosAdmin.appendChild(card);
    });
}

if (inputBuscarUsuario) {
    inputBuscarUsuario.addEventListener('input', renderizarPanelAdmin);
}

if (formAdminEditar) {
    formAdminEditar.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!usuarioActivo || usuarioActivo.rol !== 'admin') return;

        const esValido = reglasAdminEditar.map(regla => validarCampo(regla)).every(Boolean);
        if (!esValido) {
            mostrarFeedbackAdmin('Corrige los campos marcados en rojo antes de guardar.', 'error');
            return;
        }

        const idEditar = document.getElementById('admin-edit-id').value;
        const nuevoNombre = document.getElementById('admin-edit-nombre').value.trim();
        const nuevoTelefono = document.getElementById('admin-edit-telefono').value.trim();
        const nuevaDireccion = document.getElementById('admin-edit-direccion').value.trim();
        const nuevoEmail = document.getElementById('admin-edit-email').value.trim().toLowerCase();
        const nuevoRol = document.getElementById('admin-edit-rol').value;

        const index = usuarios.findIndex(u => String(u.id) === String(idEditar));
        if (index === -1) return;

        const correoDuplicado = usuarios.some(
            (u, idx) => idx !== index && u.email.toLowerCase() === nuevoEmail
        );
        if (correoDuplicado) {
            mostrarError(
                document.getElementById('admin-edit-email'),
                'Otro usuario ya utiliza este correo.',
                document.getElementById('error-admin-edit-email')
            );
            mostrarFeedbackAdmin('No se pudo guardar: el correo ya pertenece a otra cuenta.', 'error');
            return;
        }

        // Evitar que el sistema quede sin ningún administrador
        const totalAdminsActual = usuarios.filter(u => u.rol === 'admin').length;
        if (usuarios[index].rol === 'admin' && nuevoRol !== 'admin' && totalAdminsActual <= 1) {
            mostrarFeedbackAdmin('Debe permanecer al menos una cuenta con rol Administrador.', 'error');
            return;
        }

        usuarios[index].nombre = nuevoNombre;
        usuarios[index].telefono = nuevoTelefono;
        usuarios[index].direccion = nuevaDireccion;
        usuarios[index].email = nuevoEmail;
        usuarios[index].rol = nuevoRol;

        guardarUsuarios();

        // Si el administrador editó su propia cuenta activa, refrescar sesión y vista
        if (String(usuarioActivo.id) === String(idEditar)) {
            usuarioActivo = usuarios[index];
            localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
            actualizarEncabezadoUsuario();
            if (usuarioActivo.rol !== 'admin') {
                cambiarVistaActiva('tienda');
                return;
            }
        }

        cerrarFormulariosAdmin();
        renderizarPanelAdmin();
        mostrarFeedbackAdmin(`✓ Datos de "${nuevoNombre}" actualizados exitosamente.`, 'exito');
    });
}

if (formAdminPassword) {
    formAdminPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!usuarioActivo || usuarioActivo.rol !== 'admin') return;

        const esValido = reglasAdminPassword.map(regla => validarCampo(regla)).every(Boolean);
        if (!esValido) {
            mostrarFeedbackAdmin('Verifica que la nueva contraseña cumpla los requisitos y coincida.', 'error');
            return;
        }

        const idPass = document.getElementById('admin-pass-id').value;
        const nuevaPassword = document.getElementById('admin-nueva-password').value;

        const index = usuarios.findIndex(u => String(u.id) === String(idPass));
        if (index === -1) return;

        usuarios[index].password = nuevaPassword;
        guardarUsuarios();

        if (String(usuarioActivo.id) === String(idPass)) {
            usuarioActivo = usuarios[index];
            localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
        }

        const nombreUsuario = usuarios[index].nombre;
        cerrarFormulariosAdmin();
        renderizarPanelAdmin();
        mostrarFeedbackAdmin(`🔑 Contraseña de "${nombreUsuario}" restablecida correctamente.`, 'exito');
    });
}

if (usuarioActivo) {
    iniciarSesion(usuarioActivo);
}
