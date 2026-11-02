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
const btnAutofillJesus = document.getElementById('btn-autofill-jesus');
const btnAutofillLysney = document.getElementById('btn-autofill-lysney');

// Expresiones regulares para validación del lado del cliente
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^\d{10}$/;
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/;

// Usuarios demo iniciales del equipo
const usuariosDemo = [
    {
        id: 1,
        nombre: "Jesús Contreras",
        telefono: "3028348399",
        email: "jdcontrerast@gmail.com",
        direccion: "Avenida Principal 123",
        password: "Demo12345",
        carrito: [
            { id: "1", nombre: "Producto A", precio: 10 }
        ]
    },
    {
        id: 2,
        nombre: "Lysney Simancas Segovia",
        telefono: "3015557890",
        email: "lysney.simancas@correo.com",
        direccion: "Calle 45 # 12-30",
        password: "Demo12345",
        carrito: []
    }
];

let usuarios = JSON.parse(localStorage.getItem('tienda_usuarios')) || [];

// Garantizar que las cuentas demo del equipo existan y estén actualizadas
usuariosDemo.forEach((demo) => {
    const existente = usuarios.find(u => u.email === demo.email);
    if (!existente) {
        usuarios.push({ ...demo });
    } else {
        if (!existente.telefono) existente.telefono = demo.telefono;
        if (!existente.direccion) existente.direccion = demo.direccion;
        if (existente.password === "123") existente.password = demo.password;
    }
});
localStorage.setItem('tienda_usuarios', JSON.stringify(usuarios));

let usuarioActivo = JSON.parse(localStorage.getItem('tienda_usuario_activo')) || null;

// Funciones reutilizables de validación de formularios
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

// Reglas declarativas para Login y Registro
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

// Conectar validación en tiempo real en cada campo
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

function rellenarDemo(usuario) {
    const inputEmail = document.getElementById('login-email');
    const inputPassword = document.getElementById('login-password');
    inputEmail.value = usuario.email;
    inputPassword.value = usuario.password;
    reglasLogin.forEach(regla => validarCampo(regla));
    mostrarMensaje(`Datos de ${usuario.nombre} cargados. Haz clic en Ingresar.`, 'exito');
}

if (btnAutofillJesus) {
    btnAutofillJesus.addEventListener('click', () => rellenarDemo(usuariosDemo[0]));
}

if (btnAutofillLysney) {
    btnAutofillLysney.addEventListener('click', () => rellenarDemo(usuariosDemo[1]));
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
        carrito: []
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
    }, 1200);
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
    formLogin.reset();
    limpiarEstadoFormulario(formLogin);

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
