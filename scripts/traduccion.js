document.addEventListener('DOMContentLoaded', function () {
    const btnEspanol = document.getElementById('btn-espanol');
    const btnIngles = document.getElementById('btn-ingles');
    const elementosTraducibles = document.querySelectorAll('[data-lang-key]');
    let idiomaActual = 'es'; // Idioma por defecto

    // Traducciones codificadas directamente
    const traducciones = {
        "es": {
        "minombre": "Guillermo",
        "misapellidos": "Santos Sánchez",
        "soyHeader": "Soy <span>Desarrollador BackEnd</span>",
        "header-descript": "Apasionado por resolver problemas complejos y crear soluciones eficientes. Mi curiosidad por entender cómo funcionan las cosas me llevó al mundo de la programación, donde aplico mi enfoque analítico y metódico para desarrollar sistemas robustos y escalables.",
        "about-me": "¿Quién Soy?",
        "technologies": "Técnologías",
        "projects": "Proyectos",
        "experience": "Esperiencia",
        "contact": "Contácto",
        "upBttn": "Arriba",
        "notText": "El correo ha sido copiado a tu portapapeles",
        "fullstack": "Desarrollador Full-Stack",
        "sc0-descript": "Creo soluciones tecnológicas que combinan eficiencia y creatividad. Mi enfoque metódico y mi pasión por aprender me permiten enfrentar desafíos técnicos con confianza y determinación.",
        "hobby": "Hobbies",
        "sc1-descrip1": "Soy un desarrollador BackEnd con experiencia en Java, C/C++ y Docker. Mi curiosidad por entender cómo funcionan las cosas me llevó a la programación, donde disfruto resolviendo problemas complejos y creando soluciones eficientes.",
        "sc1-descrip2": "En mi tiempo libre, disfruto de la música, el cine y el dibujo. La robótica también ha sido una gran pasión, aunque ahora es más parte de mi trabajo que de mi ocio.",
        "caracteristicas": "Características",
        "encuentrame": "Puedes encontrarme en",
        "sc1-descrip3": "Conéctate conmigo en <a href=\"https://www.linkedin.com/in/tu-perfil\" target=\"_blank\">LinkedIn</a> o revisa mis proyectos en <a href=\"https://github.com/tu-usuario\" target=\"_blank\">GitHub</a>.",
        "otros": "Otros",
        "comSer": "Comunicación Serial",
        "comSer-descrip": "Desarrollo e implementación de un sistema de comunicación serial para una embarcación de competición. Utilicé C y Docker para garantizar la transmisión de datos en tiempo real.",
        "rfid": "Control de acceso por RFID",
        "rfid-descrip": "Sistema de control de acceso y monitoreo mediante tarjetas RFID. Desarrollé la lógica en C/C++ y diseñé una interfaz web para la visualización de datos.",
        "paqueteria": "Gestor de Paquetería",
        "paqueteria-descrip": "Aplicación para la gestión de lockers de recogida de paquetes en diferentes campus. Utilicé Java y MySQL para garantizar un sistema robusto y escalable.",
        "webIt": "Diseño WEB Servicios IT",
        "webIt-descrip": "Página web diseñada para alojar servicios IT. Encargado del diseño responsive y planteamiento de la sección de servicios IT",
        "upmGrado": "Doble Grado Ing. Telemática y Electrónica",
        "fgUpm-tit": "Monitor de Ingeniería",
        "fgUpm-info1": "Organización y supervisión de talleres de robótica y programación.",
        "fgUpm-info2": "Dirección de equipos de hasta 7 personas.",
        "cara-tit": "Profesor de Robótica",
        "cara-info1": "Formación a más de 100 estudiantes en programación y robótica.",
        "cara-info2": "Diseño de actividades con metodología STEAM.",
        "dam-tit": "Grado Superior DAM",
        "dam-info": "Desarrollo de sistemas de comunicación para una embarcación de competición.",
        "gfs-tit": "Técnico de Control y Telemetría",
        "gfs-info": "Desarrollo de sistemas de comunicación para una embarcación de competición.",
        "name": "Nombre",
        "mail": "Correo",
        "tel": "Teléfono",
        "asunto": "Asunto",
        "mnsj": "Mensaje",
        "send": "Enviar",
        "rst": "Restablecer",
        "err-name": "Por favor, ingresa tu nombre.",
        "mail-name": "Por favor, ingresa un correo válido.",
        "err-tel": "Por favor, ingresa un número de teléfono válido.",
        "asunto-name": "Por favor, ingresa un asunto.",
        "err-mnsj": "Por favor, ingresa un mensaje."
      },
    "en": {
        "minombre": "Guillermo",
        "misapellidos": "Santos Sánchez",
        "soyHeader": "I am a <span>BackEnd Developer</span>",
        "header-descript": "Passionate about solving complex problems and creating efficient solutions. My curiosity to understand how things work led me to the world of programming, where I apply my analytical and methodical approach to develop robust and scalable systems.",
        "about-me": "About Me",
        "technologies": "Technologies",
        "projects": "Projects",
        "experience": "Experience",
        "contact": "Contact",
        "upBttn": "Up",
        "notText": "The email has been copied to your clipboard.",
        "fullstack": "Full-Stack Developer",
        "sc0-descript": "I create technological solutions that combine efficiency and creativity. My methodical approach and passion for learning allow me to face technical challenges with confidence and determination.",
        "hobby": "Hobbies",
        "sc1-descrip1": "I am a BackEnd developer with experience in Java, C/C++, and Docker. My curiosity to understand how things work led me to programming, where I enjoy solving complex problems and creating efficient solutions.",
        "sc1-descrip2": "In my free time, I enjoy music, movies, and drawing. Robotics has also been a great passion, although now it is more part of my work than my leisure.",
        "caracteristicas": "Characteristics",
        "encuentrame": "You can find me on",
        "sc1-descrip3": "Connect with me on <a href=\"https://www.linkedin.com/in/tu-perfil\" target=\"_blank\">LinkedIn</a> or check out my projects on <a href=\"https://github.com/tu-usuario\" target=\"_blank\">GitHub</a>.",
        "otros": "Others",
        "comSer": "Serial Communication",
        "comSer-descrip": "Development and implementation of a serial communication system for a competition boat. I used C and Docker to ensure real-time data transmission.",
        "rfid": "RFID Access Control",
        "rfid-descrip": "Access control and monitoring system using RFID cards. I developed the logic in C/C++ and designed a web interface for data visualization.",
        "paqueteria": "Package Manager",
        "paqueteria-descrip": "Application for managing package pick-up lockers across different campuses. I used Java and MySQL to ensure a robust and scalable system.",
        "webIt": "IT Services Web Design",
        "webIt-descrip": "Website designed to host IT services. Responsible for responsive design and planning the IT services section.",
        "upmGrado": "Double Degree in Telematics and Electronics Engineering",
        "fgUpm-tit": "Engineering Monitor",
        "fgUpm-info1": "Organization and supervision of robotics and programming workshops.",
        "fgUpm-info2": "Leading teams of up to 7 people.",
        "cara-tit": "Robotics Teacher",
        "cara-info1": "Trained over 100 students in programming and robotics.",
        "cara-info2": "Designed activities using the STEAM methodology.",
        "dam-tit": "Higher Degree in Application Development (DAM)",
        "dam-info": "Development of communication systems for a competition boat.",
        "gfs-tit": "Control and Telemetry Technician",
        "gfs-info": "Development of communication systems for a competition boat.",
        "name": "Name",
        "mail": "Email",
        "tel": "Phone",
        "asunto": "Subject",
        "mnsj": "Message",
        "send": "Send",
        "rst": "Reset",
        "err-name": "Please enter your name.",
        "mail-name": "Please enter a valid email.",
        "err-tel": "Please enter a valid phone number.",
        "asunto-name": "Please enter a subject.",
        "err-mnsj": "Please enter a message."
      }
    };

    // Función para cambiar el idioma
    function cambiarIdioma(idioma) {
        if (!traducciones[idioma]) {
            console.error(`Idioma no disponible: ${idioma}`);
            return;
        }

        elementosTraducibles.forEach(elemento => {
            const clave = elemento.getAttribute('data-lang-key');
            if (traducciones[idioma][clave]) {
                elemento.innerHTML = traducciones[idioma][clave];
            } else {
                console.warn(`Clave no encontrada para "${clave}" en "${idioma}"`);
            }
        });

        idiomaActual = idioma;
        resaltarBoton(idioma);
    }

    // Función para resaltar el botón del idioma actual
    function resaltarBoton(idioma) {
        btnEspanol.classList.toggle('sel', idioma === 'es');
        btnIngles.classList.toggle('sel', idioma === 'en');
    }

    // Event listeners para los botones
    btnEspanol.addEventListener('click', function () {
        if (idiomaActual !== 'es') {
            cambiarIdioma('es');
        }
    });

    btnIngles.addEventListener('click', function () {
        if (idiomaActual !== 'en') {
            cambiarIdioma('en');
        }
    });

    // Inicializar con el idioma por defecto
    cambiarIdioma(idiomaActual);
});
