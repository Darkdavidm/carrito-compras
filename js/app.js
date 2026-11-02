const btnTheme = document.getElementById('btn-theme');
const btnMenu = document.getElementById('btn-menu');
const navPanel = document.getElementById('nav-panel');
const body = document.body;

function aplicarTema(modoOscuro) {
    body.classList.toggle('dark-mode', modoOscuro);
    btnTheme.textContent = modoOscuro ? 'Modo Claro' : 'Modo Oscuro';
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

const categoriasIniciales = ['Audio', 'Periféricos', 'Accesorios'];

const productosIniciales = [
    {
        id: '1',
        nombre: 'Audífonos Bluetooth ANC',
        categoria: 'Audio',
        precio: 85,
        descripcion: 'Cancelación activa de ruido híbrida, micrófono HD y batería de 30 horas.',
        imagen: 'img/audifonos.jpg'
    },
    {
        id: '2',
        nombre: 'Teclado Mecánico RGB',
        categoria: 'Periféricos',
        precio: 120,
        descripcion: 'Switches táctiles silenciosos, chasis compacto e iluminación RGB personalizable.',
        imagen: 'img/teclado.jpg'
    },
    {
        id: '3',
        nombre: 'Mouse Inalámbrico Pro',
        categoria: 'Periféricos',
        precio: 45,
        descripcion: 'Sensor óptico de alta precisión, diseño ergonómico y batería recargable.',
        imagen: 'img/mouse.jpg'
    },
    {
        id: '4',
        nombre: 'Webcam Full HD 1080p',
        categoria: 'Accesorios',
        precio: 65,
        descripcion: 'Lente gran angular con enfoque automático y micrófono estéreo integrado.',
        imagen: 'img/webcam.jpg'
    },
    {
        id: '5',
        nombre: 'Parlante Portátil Smart',
        categoria: 'Audio',
        precio: 70,
        descripcion: 'Sonido envolvente 360° de alta fidelidad resistente a salpicaduras.',
        imagen: 'img/parlante.jpg'
    },
    {
        id: '6',
        nombre: 'Base Refrigerante Laptop',
        categoria: 'Accesorios',
        precio: 35,
        descripcion: 'Estructura de aluminio con doble ventilador silencioso LED y altura ajustable.',
        imagen: 'img/base-laptop.jpg'
    }
];

function generarPlaceholderSVG(titulo = 'Producto') {
    const textoSeguro = String(titulo).slice(0, 22).replace(/[<>&"']/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340"><rect width="480" height="340" fill="#e2e8f0"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="Segoe UI, Arial" font-size="22" font-weight="bold">${textoSeguro}</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="Segoe UI, Arial" font-size="14">Imagen no disponible</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

let categorias = JSON.parse(localStorage.getItem('tienda_categorias'));
if (!Array.isArray(categorias) || categorias.length === 0) {
    categorias = [...categoriasIniciales];
    localStorage.setItem('tienda_categorias', JSON.stringify(categorias));
}

let productos = JSON.parse(localStorage.getItem('tienda_productos'));
if (!Array.isArray(productos) || productos.length === 0) {
    productos = productosIniciales.map(p => ({ ...p }));
    localStorage.setItem('tienda_productos', JSON.stringify(productos));
}

function guardarCategorias() {
    localStorage.setItem('tienda_categorias', JSON.stringify(categorias));
}

function guardarProductos() {
    localStorage.setItem('tienda_productos', JSON.stringify(productos));
}

const seccionAuth = document.getElementById('seccion-auth');
const seccionTienda = document.getElementById('seccion-tienda');
const seccionAdmin = document.getElementById('seccion-admin');
const userHeaderInfo = document.getElementById('user-header-info');
const userName = document.getElementById('user-name');
const userRolBadge = document.getElementById('user-rol-badge');
const userDatos = document.getElementById('user-datos');
const headerBadgeCarrito = document.getElementById('header-badge-carrito');
const btnLogout = document.getElementById('btn-logout');

const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const authMensaje = document.getElementById('auth-mensaje');
const btnAutofillLysney = document.getElementById('btn-autofill-lysney');
const btnAutofillJesus = document.getElementById('btn-autofill-jesus');
const btnOlvidoClave = document.getElementById('btn-olvido-clave');

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^\d{10}$/;
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;

const usuariosDemo = [
    {
        id: 2,
        nombre: 'Lysney Simancas Segovia',
        telefono: '3015557890',
        email: 'lysney.simancas@correo.com',
        direccion: 'Calle 45 # 12-30',
        password: 'Demo12345',
        rol: 'admin',
        carrito: [],
        pedidos: []
    },
    {
        id: 1,
        nombre: 'Jesús Contreras',
        telefono: '3028348399',
        email: 'jdcontrerast@gmail.com',
        direccion: 'Avenida Principal 123',
        password: 'Demo12345',
        rol: 'cliente',
        carrito: [
            { id: '1', nombre: 'Audífonos Bluetooth ANC', precio: 85, cantidad: 1 }
        ],
        pedidos: []
    }
];

function normalizarCarrito(carrito = []) {
    const mapa = new Map();
    carrito.forEach((item) => {
        const id = String(item.id);
        const cantidad = Number(item.cantidad) > 0 ? Number(item.cantidad) : 1;
        const prodCatalogo = productos.find(p => String(p.id) === id);
        const nombre = prodCatalogo
            ? prodCatalogo.nombre
            : (item.nombre === 'Producto A' ? 'Audífonos Bluetooth ANC' : item.nombre);
        const precio = prodCatalogo
            ? Number(prodCatalogo.precio)
            : (item.nombre === 'Producto A' ? 85 : (Number(item.precio) || 0));

        if (mapa.has(id)) {
            mapa.get(id).cantidad += cantidad;
        } else {
            mapa.set(id, { id, nombre, precio, cantidad });
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

function guardarUsuarios() {
    localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));
}

guardarUsuarios();

let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;
if (usuarioActivo) {
    const actualizado = usuarios.find(u => u.id === usuarioActivo.id || u.email === usuarioActivo.email);
    usuarioActivo = actualizado || null;
}

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
    const campos = formulario.querySelectorAll('input, textarea, select');
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

    if (regla.esNumeroPositivo) {
        const numero = Number(valor);
        if (Number.isNaN(numero) || numero <= 0) {
            mostrarError(campo, regla.mensajeNumero || 'Ingresa un valor mayor a 0.', elementoError);
            return false;
        }
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

const reglasProductoAdmin = [
    {
        id: 'prod-nombre',
        errorId: 'error-prod-nombre',
        requerido: true,
        minLength: 3,
        mensajeVacio: 'El nombre del producto es obligatorio.'
    },
    {
        id: 'prod-precio',
        errorId: 'error-prod-precio',
        requerido: true,
        esNumeroPositivo: true,
        mensajeVacio: 'Indica el precio de venta.',
        mensajeNumero: 'El precio debe ser mayor a $0.'
    },
    {
        id: 'prod-categoria',
        errorId: 'error-prod-categoria',
        requerido: true,
        mensajeVacio: 'Selecciona una categoría.'
    },
    {
        id: 'prod-descripcion',
        errorId: 'error-prod-descripcion',
        requerido: true,
        minLength: 8,
        mensajeVacio: 'Agrega una descripción breve del producto.'
    },
    {
        id: 'prod-url-imagen',
        errorId: 'error-prod-url-imagen',
        requerido: true,
        mensajeVacio: 'Sube una imagen desde el equipo o ingresa la ruta/URL.'
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
registrarValidacionTiempoReal(reglasProductoAdmin);
registrarValidacionTiempoReal(reglasAdminEditar);
registrarValidacionTiempoReal(reglasAdminPassword, 'admin-nueva-password', 'admin-confirmar-password');

function rellenarDemo(emailDemo) {
    const usuario = usuarios.find(u => u.email === emailDemo);
    if (!usuario) return;
    document.getElementById('login-email').value = usuario.email;
    document.getElementById('login-password').value = usuario.password;
    reglasLogin.forEach(regla => validarCampo(regla));
    const destino = usuario.rol === 'admin' ? 'Panel de Administración' : 'Tienda de Compras';
    mostrarMensaje(`Datos de ${usuario.nombre} cargados para ingresar a ${destino}.`, 'exito');
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
            'Si olvidaste tu contraseña, ingresa con una cuenta Administrador (ej. Lysney Simancas) y restablécela en "Usuarios y Contraseñas".',
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

    mostrarMensaje('Cuenta creada con éxito. Redirigiendo a inicio de sesión...', 'exito');
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
        userRolBadge.textContent = esAdmin ? 'Admin' : 'Cliente';
        userRolBadge.classList.toggle('es-admin', esAdmin);
    }

    if (headerBadgeCarrito) {
        headerBadgeCarrito.classList.toggle('oculto', esAdmin);
    }

    userDatos.textContent = `Tel: ${usuarioActivo.telefono || 'Sin teléfono'} | Correo: ${usuarioActivo.email} | Dir: ${usuarioActivo.direccion || 'Sin dirección'}`;
}

function iniciarSesion(usuario) {
    usuarioActivo = usuario;
    localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));

    seccionAuth.classList.add('oculto');
    userHeaderInfo.classList.remove('oculto');
    actualizarEncabezadoUsuario();

    limpiarMensaje();
    limpiarMensajeCarrito();
    formLogin.reset();
    limpiarEstadoFormulario(formLogin);

    if (usuarioActivo.rol === 'admin') {
        seccionTienda.classList.add('oculto');
        seccionAdmin.classList.remove('oculto');
        activarTabAdmin('productos');
    } else {
        seccionAdmin.classList.add('oculto');
        seccionTienda.classList.remove('oculto');
        usuarioActivo.carrito = normalizarCarrito(usuarioActivo.carrito);
        sincronizarUsuarioActivo();
        renderizarFiltrosTienda();
        renderizarCatalogoTienda();
        renderizarCarrito();
        renderizarPedidos();
    }
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

function mostrarMensaje(texto, tipo) {
    authMensaje.textContent = texto;
    authMensaje.className = `mensaje-${tipo}`;
}

function limpiarMensaje() {
    authMensaje.textContent = '';
    authMensaje.className = '';
}

const inputBuscar = document.getElementById('input-buscar');
const contenedorFiltrosTienda = document.getElementById('filtros-categoria');
const gridProductosTienda = document.getElementById('grid-productos');
const contadorResultados = document.getElementById('contador-resultados');
const sinResultados = document.getElementById('sin-resultados');

let categoriaSeleccionadaTienda = 'todos';

function renderizarFiltrosTienda() {
    if (!contenedorFiltrosTienda) return;
    contenedorFiltrosTienda.innerHTML = '';

    if (categoriaSeleccionadaTienda !== 'todos' && !categorias.includes(categoriaSeleccionadaTienda)) {
        categoriaSeleccionadaTienda = 'todos';
    }

    const opciones = ['todos', ...categorias];
    opciones.forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn-filtro ${categoriaSeleccionadaTienda === cat ? 'activo' : ''}`;
        btn.setAttribute('data-filtro', cat);
        btn.textContent = cat === 'todos' ? 'Todos' : cat;
        btn.addEventListener('click', () => {
            categoriaSeleccionadaTienda = cat;
            renderizarFiltrosTienda();
            renderizarCatalogoTienda();
        });
        contenedorFiltrosTienda.appendChild(btn);
    });
}

function renderizarCatalogoTienda() {
    if (!gridProductosTienda) return;
    gridProductosTienda.innerHTML = '';

    const termino = (inputBuscar ? inputBuscar.value : '').trim().toLowerCase();

    const filtrados = productos.filter((prod) => {
        const coincideCategoria =
            categoriaSeleccionadaTienda === 'todos' || prod.categoria === categoriaSeleccionadaTienda;
        const texto = `${prod.nombre} ${prod.categoria} ${prod.descripcion}`.toLowerCase();
        const coincideBusqueda = termino === '' || texto.includes(termino);
        return coincideCategoria && coincideBusqueda;
    });

    if (contadorResultados) {
        contadorResultados.textContent = `Mostrando ${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`;
    }

    if (sinResultados) {
        sinResultados.classList.toggle('oculto', filtrados.length > 0);
    }

    filtrados.forEach((prod) => {
        const article = document.createElement('article');
        article.classList.add('producto');
        article.setAttribute('data-categoria', prod.categoria);

        const divImg = document.createElement('div');
        divImg.classList.add('producto-img-wrap');

        const img = document.createElement('img');
        img.classList.add('producto-img');
        img.src = prod.imagen || generarPlaceholderSVG(prod.nombre);
        img.alt = prod.nombre;
        img.addEventListener('error', () => {
            img.src = generarPlaceholderSVG(prod.nombre);
        }, { once: true });

        divImg.appendChild(img);

        const divCuerpo = document.createElement('div');
        divCuerpo.classList.add('producto-cuerpo');

        const divSuperior = document.createElement('div');
        divSuperior.style.display = 'flex';
        divSuperior.style.flexDirection = 'column';

        const spanTag = document.createElement('span');
        spanTag.classList.add('producto-tag');
        spanTag.textContent = prod.categoria;

        const h3 = document.createElement('h3');
        h3.textContent = prod.nombre;

        const pDesc = document.createElement('p');
        pDesc.classList.add('producto-desc');
        pDesc.textContent = prod.descripcion;

        divSuperior.appendChild(spanTag);
        divSuperior.appendChild(h3);
        divSuperior.appendChild(pDesc);

        const divInferior = document.createElement('div');

        const pPrecio = document.createElement('p');
        pPrecio.classList.add('producto-precio');
        pPrecio.textContent = `$${prod.precio}`;

        const btnAgregar = document.createElement('button');
        btnAgregar.type = 'button';
        btnAgregar.classList.add('btn-agregar');
        btnAgregar.setAttribute('data-id', String(prod.id));
        btnAgregar.setAttribute('data-nombre', prod.nombre);
        btnAgregar.setAttribute('data-precio', String(prod.precio));
        btnAgregar.textContent = 'Agregar al Carrito';
        btnAgregar.addEventListener('click', agregarAlCarrito);

        divInferior.appendChild(pPrecio);
        divInferior.appendChild(btnAgregar);

        divCuerpo.appendChild(divSuperior);
        divCuerpo.appendChild(divInferior);

        article.appendChild(divImg);
        article.appendChild(divCuerpo);
        gridProductosTienda.appendChild(article);
    });
}

if (inputBuscar) {
    inputBuscar.addEventListener('input', renderizarCatalogoTienda);
}

const listaCarrito = document.getElementById('lista-carrito');
const contenedorTotal = document.getElementById('total-carrito');
const cantidadTotalItems = document.getElementById('cantidad-total-items');
const headerContadorCarrito = document.getElementById('header-contador-carrito');
const btnVaciar = document.getElementById('btn-vaciar');
const btnComprar = document.getElementById('btn-comprar');
const carritoMensaje = document.getElementById('carrito-mensaje');
const listaPedidos = document.getElementById('lista-pedidos');

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
    if (!usuarioActivo || usuarioActivo.rol === 'admin') return;

    const boton = e.currentTarget;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    if (!Array.isArray(usuarioActivo.carrito)) {
        usuarioActivo.carrito = [];
    }

    const existente = usuarioActivo.carrito.find(item => String(item.id) === String(id));
    if (existente) {
        existente.nombre = nombre;
        existente.precio = precio;
        existente.cantidad += 1;
    } else {
        usuarioActivo.carrito.push({ id: String(id), nombre, precio, cantidad: 1 });
    }

    sincronizarUsuarioActivo();
    renderizarCarrito();
    mostrarMensajeCarrito(`"${nombre}" agregado al carrito.`, 'exito');
}

function cambiarCantidad(id, cambio) {
    if (!usuarioActivo || !Array.isArray(usuarioActivo.carrito)) return;
    const index = usuarioActivo.carrito.findIndex(item => String(item.id) === String(id));
    if (index === -1) return;

    usuarioActivo.carrito[index].cantidad += cambio;
    if (usuarioActivo.carrito[index].cantidad <= 0) {
        usuarioActivo.carrito.splice(index, 1);
    }

    limpiarMensajeCarrito();
    sincronizarUsuarioActivo();
    renderizarCarrito();
}

function eliminarProductoCarrito(id) {
    if (!usuarioActivo || !Array.isArray(usuarioActivo.carrito)) return;
    usuarioActivo.carrito = usuarioActivo.carrito.filter(item => String(item.id) !== String(id));
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
        const subtotal = Math.round(producto.precio * cantidad * 100) / 100;
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
        btnEliminar.addEventListener('click', () => eliminarProductoCarrito(producto.id));

        divControles.appendChild(btnMenos);
        divControles.appendChild(spanCantidad);
        divControles.appendChild(btnMas);
        divControles.appendChild(btnEliminar);

        divItem.appendChild(divInfo);
        divItem.appendChild(divControles);
        listaCarrito.appendChild(divItem);
    });

    contenedorTotal.textContent = Math.round(totalPrecio * 100) / 100;
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

        const totalPedido = Math.round(
            usuarioActivo.carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0) * 100
        ) / 100;
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
        mostrarMensajeCarrito(`Compra ${nuevoPedido.folio} confirmada por $${totalPedido}.`, 'exito');
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

const tabAdminProductos = document.getElementById('tab-admin-productos');
const tabAdminUsuarios = document.getElementById('tab-admin-usuarios');
const subvistaAdminProductos = document.getElementById('subvista-admin-productos');
const subvistaAdminUsuarios = document.getElementById('subvista-admin-usuarios');

const kpiTotalProductos = document.getElementById('kpi-total-productos');
const kpiTotalCategorias = document.getElementById('kpi-total-categorias');
const kpiTotalUsuarios = document.getElementById('kpi-total-usuarios');
const kpiTotalPedidos = document.getElementById('kpi-total-pedidos');

function actualizarKPIsAdmin() {
    const totalPedidosSistema = usuarios.reduce(
        (acc, u) => acc + (Array.isArray(u.pedidos) ? u.pedidos.length : 0),
        0
    );

    if (kpiTotalProductos) kpiTotalProductos.textContent = String(productos.length);
    if (kpiTotalCategorias) kpiTotalCategorias.textContent = String(categorias.length);
    if (kpiTotalUsuarios) kpiTotalUsuarios.textContent = String(usuarios.length);
    if (kpiTotalPedidos) kpiTotalPedidos.textContent = String(totalPedidosSistema);
}

function activarTabAdmin(modulo) {
    if (!usuarioActivo || usuarioActivo.rol !== 'admin') return;
    const esProductos = modulo === 'productos';

    if (tabAdminProductos && tabAdminUsuarios) {
        tabAdminProductos.classList.toggle('activo', esProductos);
        tabAdminUsuarios.classList.toggle('activo', !esProductos);
    }

    if (subvistaAdminProductos && subvistaAdminUsuarios) {
        subvistaAdminProductos.classList.toggle('oculto', !esProductos);
        subvistaAdminUsuarios.classList.toggle('oculto', esProductos);
    }

    actualizarKPIsAdmin();

    if (esProductos) {
        renderizarCategoriasAdmin();
        poblarSelectoresCategoriaAdmin();
        renderizarProductosAdmin();
        prepararNuevoProducto();
    } else {
        cerrarFormulariosAdmin();
        limpiarFeedbackAdmin();
        renderizarPanelAdmin();
    }
}

if (tabAdminProductos) {
    tabAdminProductos.addEventListener('click', () => activarTabAdmin('productos'));
}

if (tabAdminUsuarios) {
    tabAdminUsuarios.addEventListener('click', () => activarTabAdmin('usuarios'));
}

const formNuevaCategoria = document.getElementById('form-nueva-categoria');
const inputNuevaCategoria = document.getElementById('input-nueva-categoria');
const listaCategoriasAdmin = document.getElementById('lista-categorias-admin');
const adminCatMensaje = document.getElementById('admin-cat-mensaje');
const btnRestaurarCatalogo = document.getElementById('btn-restaurar-catalogo');

const inputBuscarProdAdmin = document.getElementById('input-buscar-prod-admin');
const filtroCatAdmin = document.getElementById('filtro-cat-admin');
const listaProductosAdmin = document.getElementById('lista-productos-admin');
const adminProdMensaje = document.getElementById('admin-prod-mensaje');
const btnNuevoProducto = document.getElementById('btn-nuevo-producto');

const tituloFormProducto = document.getElementById('titulo-form-producto');
const formAdminProducto = document.getElementById('form-admin-producto');
const prodEditId = document.getElementById('prod-edit-id');
const prodPreviewImg = document.getElementById('prod-preview-img');
const prodPreviewLabel = document.getElementById('prod-preview-label');
const prodNombre = document.getElementById('prod-nombre');
const prodPrecio = document.getElementById('prod-precio');
const prodCategoria = document.getElementById('prod-categoria');
const prodDescripcion = document.getElementById('prod-descripcion');
const prodArchivoImagen = document.getElementById('prod-archivo-imagen');
const prodUrlImagen = document.getElementById('prod-url-imagen');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');

function mostrarFeedbackCategoria(texto, tipo) {
    if (!adminCatMensaje) return;
    adminCatMensaje.textContent = texto;
    adminCatMensaje.className = `admin-feedback mensaje-${tipo}`;
}

function mostrarFeedbackProducto(texto, tipo) {
    if (!adminProdMensaje) return;
    adminProdMensaje.textContent = texto;
    adminProdMensaje.className = `admin-feedback mensaje-${tipo}`;
}

function poblarSelectoresCategoriaAdmin() {
    if (prodCategoria) {
        const valorPrevio = prodCategoria.value;
        prodCategoria.innerHTML = '';
        categorias.forEach((cat) => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            prodCategoria.appendChild(opt);
        });
        if (categorias.includes(valorPrevio)) {
            prodCategoria.value = valorPrevio;
        }
    }

    if (filtroCatAdmin) {
        const filtroPrevio = filtroCatAdmin.value || 'todos';
        filtroCatAdmin.innerHTML = '<option value="todos">Todas las categorías</option>';
        categorias.forEach((cat) => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            filtroCatAdmin.appendChild(opt);
        });
        filtroCatAdmin.value = categorias.includes(filtroPrevio) ? filtroPrevio : 'todos';
    }
}

function renderizarCategoriasAdmin() {
    if (!listaCategoriasAdmin) return;
    listaCategoriasAdmin.innerHTML = '';

    categorias.forEach((cat) => {
        const conteo = productos.filter(p => p.categoria === cat).length;

        const chip = document.createElement('span');
        chip.classList.add('chip-categoria');

        const texto = document.createElement('span');
        texto.textContent = `${cat} (${conteo})`;

        const btnQuitar = document.createElement('button');
        btnQuitar.type = 'button';
        btnQuitar.classList.add('btn-quitar-cat');
        btnQuitar.textContent = '✕';
        btnQuitar.title = `Eliminar categoría ${cat}`;
        btnQuitar.addEventListener('click', () => eliminarCategoriaAdmin(cat));

        chip.appendChild(texto);
        chip.appendChild(btnQuitar);
        listaCategoriasAdmin.appendChild(chip);
    });

    actualizarKPIsAdmin();
}

function eliminarCategoriaAdmin(nombreCat) {
    if (categorias.length <= 1) {
        mostrarFeedbackCategoria('Debe existir al menos una categoría activa en la tienda.', 'error');
        return;
    }

    const enUso = productos.filter(p => p.categoria === nombreCat).length;
    if (enUso > 0) {
        mostrarFeedbackCategoria(
            `No se puede eliminar "${nombreCat}" porque tiene ${enUso} producto(s) asignado(s). Cámbialos de categoría primero.`,
            'error'
        );
        return;
    }

    categorias = categorias.filter(c => c !== nombreCat);
    guardarCategorias();
    poblarSelectoresCategoriaAdmin();
    renderizarCategoriasAdmin();
    mostrarFeedbackCategoria(`Categoría "${nombreCat}" eliminada.`, 'exito');
}

if (formNuevaCategoria) {
    formNuevaCategoria.addEventListener('submit', (e) => {
        e.preventDefault();
        const nueva = (inputNuevaCategoria ? inputNuevaCategoria.value : '').trim();

        if (nueva.length < 3) {
            mostrarFeedbackCategoria('El nombre de la categoría debe tener al menos 3 caracteres.', 'error');
            return;
        }

        const existe = categorias.some(c => c.toLowerCase() === nueva.toLowerCase());
        if (existe) {
            mostrarFeedbackCategoria(`La categoría "${nueva}" ya existe.`, 'error');
            return;
        }

        categorias.push(nueva);
        guardarCategorias();
        inputNuevaCategoria.value = '';
        poblarSelectoresCategoriaAdmin();
        renderizarCategoriasAdmin();
        mostrarFeedbackCategoria(`Categoría "${nueva}" creada correctamente.`, 'exito');
    });
}

if (btnRestaurarCatalogo) {
    btnRestaurarCatalogo.addEventListener('click', () => {
        categorias = [...categoriasIniciales];
        productos = productosIniciales.map(p => ({ ...p }));
        guardarCategorias();
        guardarProductos();
        poblarSelectoresCategoriaAdmin();
        renderizarCategoriasAdmin();
        renderizarProductosAdmin();
        prepararNuevoProducto();
        mostrarFeedbackProducto('Catálogo e imágenes iniciales restaurados correctamente.', 'exito');
    });
}

function redimensionarImagenArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const maxAncho = 520;
                const maxAlto = 390;
                let { width, height } = img;

                if (width > maxAncho || height > maxAlto) {
                    const escala = Math.min(maxAncho / width, maxAlto / height);
                    width = Math.round(width * escala);
                    height = Math.round(height * escala);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.84));
            };
            img.onerror = () => reject(new Error('No se pudo procesar el archivo de imagen.'));
            img.src = ev.target.result;
        };
        lector.onerror = () => reject(new Error('Error al leer el archivo seleccionado.'));
        lector.readAsDataURL(archivo);
    });
}

function actualizarVistaPreviaProducto(fuente, etiqueta) {
    if (!prodPreviewImg) return;
    prodPreviewImg.onerror = () => {
        prodPreviewImg.src = generarPlaceholderSVG(prodNombre ? prodNombre.value || 'Vista Previa' : 'Vista Previa');
    };
    prodPreviewImg.src = fuente || generarPlaceholderSVG('Nuevo Producto');
    if (prodPreviewLabel) {
        prodPreviewLabel.textContent = etiqueta || 'Vista previa de la imagen';
    }
}

if (prodArchivoImagen) {
    prodArchivoImagen.addEventListener('change', async (e) => {
        const archivo = e.target.files && e.target.files[0];
        if (!archivo) return;

        if (!archivo.type.startsWith('image/')) {
            mostrarFeedbackProducto('Selecciona un archivo de imagen válido (.jpg, .png, .webp).', 'error');
            return;
        }

        try {
            const dataUrl = await redimensionarImagenArchivo(archivo);
            prodUrlImagen.value = dataUrl;
            validarCampo(reglasProductoAdmin.find(r => r.id === 'prod-url-imagen'));
            actualizarVistaPreviaProducto(dataUrl, `Imagen cargada: ${archivo.name}`);
        } catch (err) {
            mostrarFeedbackProducto(err.message, 'error');
        }
    });
}

if (prodUrlImagen) {
    prodUrlImagen.addEventListener('input', () => {
        const valor = prodUrlImagen.value.trim();
        if (valor !== '') {
            actualizarVistaPreviaProducto(
                valor,
                valor.startsWith('data:image') ? 'Imagen cargada desde el equipo' : 'Vista previa desde ruta o URL'
            );
        }
    });
}

function prepararNuevoProducto() {
    if (!formAdminProducto) return;
    formAdminProducto.reset();
    limpiarEstadoFormulario(formAdminProducto);
    prodEditId.value = '';
    poblarSelectoresCategoriaAdmin();
    if (tituloFormProducto) tituloFormProducto.textContent = 'Agregar Nuevo Producto';
    if (btnGuardarProducto) btnGuardarProducto.textContent = 'Guardar Producto';
    if (btnCancelarProducto) btnCancelarProducto.textContent = 'Limpiar';
    actualizarVistaPreviaProducto(generarPlaceholderSVG('Nuevo Producto'), 'Sube una imagen o ingresa su URL');
}

function cargarProductoParaEditar(idProd) {
    const prod = productos.find(p => String(p.id) === String(idProd));
    if (!prod) return;

    limpiarEstadoFormulario(formAdminProducto);
    poblarSelectoresCategoriaAdmin();

    prodEditId.value = String(prod.id);
    prodNombre.value = prod.nombre;
    prodPrecio.value = prod.precio;
    if (!categorias.includes(prod.categoria)) {
        categorias.push(prod.categoria);
        guardarCategorias();
        poblarSelectoresCategoriaAdmin();
        renderizarCategoriasAdmin();
    }
    prodCategoria.value = prod.categoria;
    prodDescripcion.value = prod.descripcion;
    prodUrlImagen.value = prod.imagen;
    if (prodArchivoImagen) prodArchivoImagen.value = '';

    if (tituloFormProducto) tituloFormProducto.textContent = `Editando: ${prod.nombre}`;
    if (btnGuardarProducto) btnGuardarProducto.textContent = 'Actualizar Producto';
    if (btnCancelarProducto) btnCancelarProducto.textContent = 'Cancelar';

    actualizarVistaPreviaProducto(prod.imagen, `Imagen actual de "${prod.nombre}"`);
    reglasProductoAdmin.forEach(regla => validarCampo(regla));
}

function eliminarProductoAdmin(idProd) {
    const index = productos.findIndex(p => String(p.id) === String(idProd));
    if (index === -1) return;

    const eliminado = productos[index];
    productos.splice(index, 1);
    guardarProductos();

    usuarios.forEach((u) => {
        if (Array.isArray(u.carrito)) {
            u.carrito = u.carrito.filter(item => String(item.id) !== String(idProd));
        }
    });
    guardarUsuarios();

    if (prodEditId && String(prodEditId.value) === String(idProd)) {
        prepararNuevoProducto();
    }

    renderizarCategoriasAdmin();
    renderizarProductosAdmin();
    mostrarFeedbackProducto(`Producto "${eliminado.nombre}" eliminado del catálogo.`, 'exito');
}

function renderizarProductosAdmin() {
    if (!listaProductosAdmin) return;
    actualizarKPIsAdmin();

    const termino = (inputBuscarProdAdmin ? inputBuscarProdAdmin.value : '').trim().toLowerCase();
    const catFiltro = filtroCatAdmin ? filtroCatAdmin.value : 'todos';

    const filtrados = productos.filter((p) => {
        const coincideCat = catFiltro === 'todos' || p.categoria === catFiltro;
        const texto = `${p.nombre} ${p.categoria} ${p.descripcion}`.toLowerCase();
        const coincideTexto = termino === '' || texto.includes(termino);
        return coincideCat && coincideTexto;
    });

    listaProductosAdmin.innerHTML = '';

    if (filtrados.length === 0) {
        const pVacio = document.createElement('p');
        pVacio.classList.add('carrito-vacio');
        pVacio.textContent = 'No hay productos en el inventario con ese filtro.';
        listaProductosAdmin.appendChild(pVacio);
        return;
    }

    filtrados.forEach((prod) => {
        const card = document.createElement('div');
        card.classList.add('producto-admin-card');

        const divIzq = document.createElement('div');
        divIzq.classList.add('prod-admin-izquierda');

        const img = document.createElement('img');
        img.classList.add('prod-admin-thumb');
        img.src = prod.imagen || generarPlaceholderSVG(prod.nombre);
        img.alt = prod.nombre;
        img.addEventListener('error', () => {
            img.src = generarPlaceholderSVG(prod.nombre);
        }, { once: true });

        const divTextos = document.createElement('div');
        divTextos.classList.add('prod-admin-textos');

        const divTitulo = document.createElement('div');
        divTitulo.classList.add('prod-admin-titulo');

        const spanNombre = document.createElement('span');
        spanNombre.textContent = prod.nombre;

        const spanCat = document.createElement('span');
        spanCat.className = 'tag-rol tag-rol-cliente';
        spanCat.textContent = prod.categoria;

        const spanPrecio = document.createElement('span');
        spanPrecio.classList.add('prod-admin-precio');
        spanPrecio.textContent = `$${prod.precio}`;

        divTitulo.appendChild(spanNombre);
        divTitulo.appendChild(spanCat);
        divTitulo.appendChild(spanPrecio);

        const pDesc = document.createElement('p');
        pDesc.classList.add('usuario-admin-meta');
        pDesc.textContent = prod.descripcion;

        divTextos.appendChild(divTitulo);
        divTextos.appendChild(pDesc);

        divIzq.appendChild(img);
        divIzq.appendChild(divTextos);

        const divBotones = document.createElement('div');
        divBotones.classList.add('usuario-admin-botones');

        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.classList.add('btn-editar-usr');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => cargarProductoParaEditar(prod.id));

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.classList.add('btn-borrar-usr');
        btnBorrar.textContent = 'Eliminar';
        btnBorrar.addEventListener('click', () => eliminarProductoAdmin(prod.id));

        divBotones.appendChild(btnEditar);
        divBotones.appendChild(btnBorrar);

        card.appendChild(divIzq);
        card.appendChild(divBotones);
        listaProductosAdmin.appendChild(card);
    });
}

if (inputBuscarProdAdmin) {
    inputBuscarProdAdmin.addEventListener('input', renderizarProductosAdmin);
}

if (filtroCatAdmin) {
    filtroCatAdmin.addEventListener('change', renderizarProductosAdmin);
}

if (btnNuevoProducto) {
    btnNuevoProducto.addEventListener('click', () => {
        prepararNuevoProducto();
        if (prodNombre) prodNombre.focus();
    });
}

if (btnCancelarProducto) {
    btnCancelarProducto.addEventListener('click', prepararNuevoProducto);
}

if (formAdminProducto) {
    formAdminProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!usuarioActivo || usuarioActivo.rol !== 'admin') return;

        const esValido = reglasProductoAdmin.map(regla => validarCampo(regla)).every(Boolean);
        if (!esValido) {
            mostrarFeedbackProducto('Revisa los campos del producto marcados en rojo.', 'error');
            return;
        }

        const idActual = prodEditId.value.trim();
        const datosProducto = {
            id: idActual || String(Date.now()),
            nombre: prodNombre.value.trim(),
            precio: Math.round(Number(prodPrecio.value) * 100) / 100,
            categoria: prodCategoria.value,
            descripcion: prodDescripcion.value.trim(),
            imagen: prodUrlImagen.value.trim()
        };

        if (idActual) {
            const idx = productos.findIndex(p => String(p.id) === String(idActual));
            if (idx !== -1) {
                productos[idx] = datosProducto;
            }
            usuarios.forEach((u) => {
                if (Array.isArray(u.carrito)) {
                    u.carrito.forEach((item) => {
                        if (String(item.id) === String(idActual)) {
                            item.nombre = datosProducto.nombre;
                            item.precio = datosProducto.precio;
                        }
                    });
                }
            });
            guardarUsuarios();
            mostrarFeedbackProducto(`Producto "${datosProducto.nombre}" actualizado con éxito.`, 'exito');
        } else {
            productos.unshift(datosProducto);
            mostrarFeedbackProducto(`Nuevo producto "${datosProducto.nombre}" publicado en la tienda.`, 'exito');
        }

        guardarProductos();
        renderizarCategoriasAdmin();
        renderizarProductosAdmin();
        prepararNuevoProducto();
    });
}

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
    mostrarFeedbackAdmin(`La cuenta de "${eliminado.nombre}" fue eliminada correctamente.`, 'exito');
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
        spanRol.textContent = esAdmin ? 'Administrador' : 'Cliente';

        divTitulo.appendChild(spanNombre);
        divTitulo.appendChild(spanRol);

        const pMeta1 = document.createElement('p');
        pMeta1.classList.add('usuario-admin-meta');
        pMeta1.textContent = `Correo: ${u.email} | Tel: ${u.telefono || 'Sin teléfono'}`;

        const pMeta2 = document.createElement('p');
        pMeta2.classList.add('usuario-admin-meta');
        const numPedidos = Array.isArray(u.pedidos) ? u.pedidos.length : 0;
        pMeta2.textContent = `Dirección: ${u.direccion || 'Sin dirección'} | Pedidos: ${numPedidos}`;

        divInfo.appendChild(divTitulo);
        divInfo.appendChild(pMeta1);
        divInfo.appendChild(pMeta2);

        const divBotones = document.createElement('div');
        divBotones.classList.add('usuario-admin-botones');

        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.classList.add('btn-editar-usr');
        btnEditar.textContent = 'Editar Datos';
        btnEditar.addEventListener('click', () => abrirEdicionUsuario(u.id));

        const btnClave = document.createElement('button');
        btnClave.type = 'button';
        btnClave.classList.add('btn-clave-usr');
        btnClave.textContent = 'Cambiar Clave';
        btnClave.addEventListener('click', () => abrirCambioPasswordUsuario(u.id));

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.classList.add('btn-borrar-usr');
        btnBorrar.textContent = 'Eliminar';
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

        if (String(usuarioActivo.id) === String(idEditar)) {
            usuarioActivo = usuarios[index];
            localStorage.setItem('tienda_usuario_activo', JSON.stringify(usuarioActivo));
            if (usuarioActivo.rol !== 'admin') {
                iniciarSesion(usuarioActivo);
                return;
            }
            actualizarEncabezadoUsuario();
        }

        cerrarFormulariosAdmin();
        renderizarPanelAdmin();
        mostrarFeedbackAdmin(`Datos de "${nuevoNombre}" actualizados exitosamente.`, 'exito');
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
        mostrarFeedbackAdmin(`Contraseña de "${nombreUsuario}" restablecida correctamente.`, 'exito');
    });
}

if (usuarioActivo) {
    iniciarSesion(usuarioActivo);
}
