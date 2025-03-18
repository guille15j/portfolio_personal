document.addEventListener('DOMContentLoaded', function () {
    const btnEspanol = document.getElementById('btn-espanol');
    const btnIngles = document.getElementById('btn-ingles');
    const elementosTraducibles = document.querySelectorAll('[data-lang-key]');
    let idiomaActual = 'es'; // Idioma por defecto

    // Función para cargar las traducciones desde el archivo JSON
    function cargarTraducciones(callback) {
        fetch('lang/traducciones.json')
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error cargando las traducciones:', error));
    }

    // Función para cambiar el idioma
    function cambiarIdioma(idioma, traducciones) {
        elementosTraducibles.forEach(elemento => {
            const clave = elemento.getAttribute('data-lang-key');
            if (traducciones[idioma][clave]) {
                elemento.innerHTML = traducciones[idioma][clave];
            }
        });
        idiomaActual = idioma;
        resaltarBoton(idioma);
    }

    // Función para resaltar el botón del idioma actual
    function resaltarBoton(idioma) {
        if (idioma === 'es') {
            btnEspanol.classList.add('sel');
            btnIngles.classList.remove('sel');
        } else {
            btnIngles.classList.add('sel');
            btnEspanol.classList.remove('sel');
        }
    }

    // Event listeners para los botones
    btnEspanol.addEventListener('click', function () {
        if (idiomaActual !== 'es') {
            cargarTraducciones(function (traducciones) {
                cambiarIdioma('es', traducciones);
            });
        }
    });

    btnIngles.addEventListener('click', function () {
        if (idiomaActual !== 'en') {
            cargarTraducciones(function (traducciones) {
                cambiarIdioma('en', traducciones);
            });
        }
    });

    // Inicializar con el idioma por defecto
    cargarTraducciones(function (traducciones) {
        cambiarIdioma(idiomaActual, traducciones);
    });
});