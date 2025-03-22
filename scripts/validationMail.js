function validarMailFCN() {
    const nombre    = document.getElementById('nombre').value   ;
    const email     = document.getElementById('email').value    ;
    const phone     = document.getElementById('phone').value    ;
    const asunto    = document.getElementById('asunto').value   ;
    const mensaje   = document.getElementById('mensaje').value  ;

    const errNombre     = document.getElementById('err-name')   ;
    const errEmail      = document.getElementById('err-email')  ;
    const errTel        = document.getElementById('err-tel')    ;
    const errAsunto     = document.getElementById('asunto-err') ;
    const errMensaje    = document.getElementById('err-mnsj')   ;

    let isValid = true; 

    // validar nombre
    if (nombre === "") {
        errNombre.classList.add('show-error');
        isValid = false;
    } else if (nombre.length > 50) {
        errNombre.textContent = 'El nombre no debe superar los 50 caracteres.';
        errNombre.classList.add('show-error');
        isValid = false;
    } else {
        errNombre.classList.remove('show-error');
    }

    // validar correo
    if (email === "") {
        errEmail.textContent = 'Por favor, ingresa un correo.';
        errEmail.classList.add('show-error');
        isValid = false;
    } else if (!validateEmail(email)) {
        errEmail.textContent = 'Por favor, ingresa un correo válido.';
        errEmail.classList.add('show-error');
        isValid = false;
    } else {
        errEmail.classList.remove('show-error');
    }

    // validar teléfono
    if (phone !== "" && !validatePhone(phone)) {
        errTel.classList.add('show-error');
        isValid = false;
    } else {
        errTel.classList.remove('show-error');
    }

    // validar asunto
    if (asunto === "") {
        errAsunto.classList.add('show-error');
        isValid = false;
    } else {
        errAsunto.classList.remove('show-error');
    }

    // validar mensaje
    if (mensaje === "") {
        errMensaje.classList.add('show-error');
        isValid = false;
    } else {
        errMensaje.classList.remove('show-error');
    }

    // enviar
    if (isValid) {
        document.getElementById('contactForm').reset();
        notificacion("Enviado", "El correo ha sido enviado correctamente");
    }
}

// validar el correo
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// validar el teléfono
function validatePhone(phone) {
    const re = /^\+?[0-9]{7,}$/;
    return re.test(String(phone));
}

// restablecer el formulario y errores
document.querySelector('button[type="reset"]').addEventListener('click', function () {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.classList.remove('show-error');
    });
});

function notificacion(titulo, cuerpo) {
    const tituloNot = document.getElementById('tituloNot');
    const infoNot = document.getElementById('infoNot');
    const notification = document.querySelector(".notification");

    tituloNot.textContent = titulo;
    infoNot.textContent = cuerpo;

    notification.classList.add("active");
    setTimeout(() => { notification.classList.remove("active");}, 2200);
}