function modoOscuro(){
    var modo = document.getElementById("dark_mode").textContent;
    
    document.body.classList.toggle('dark_mode');

    if(modo==="dark_mode"){
        document.getElementById("dark_mode").textContent="light_mode";
    }else{
        document.getElementById("dark_mode").textContent="dark_mode";
    }
    
}

function verPDF() {
   window.open('resources/CV.pdf', '_blank');
}

function verLinkelin() {
   window.open('https://www.linkedin.com/in/guillermo-santos-sánchez-58750a183', '_blank');
}

function verGit() {
   window.open('https://github.com/guille15j', '_blank');
}


let isScrolling = false;
let addClass = false;

function enterTech(){
    var modo = document.getElementById("sc4");

    const sectionTop = modo.offsetTop;
    window.scrollTo({
        top: sectionTop - 70, // Cambia 500 por la posición vertical deseada
        behavior: 'smooth'
      });


      setTimeout(() => {
        scrollingDone = true;
        console.log('El scroll ha terminado. Ejecuto las acciones ahora.');
        
        // modo.classList.add('in');
        // modo.classList.toggle('out');


      }, 500); // Ajusta el tiempo según la duración del scroll

      const interval = setInterval(() => {
        if (scrollingDone) {
          clearInterval(interval); // Detener el bucle
          console.log('Ejecutando las acciones posteriores...'); 
          modo.classList.add('in');
          modo.classList.toggle('out');
        }
      }, 200); // Verificar cada 100ms
}

document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el elemento
    const element = document.getElementById('sc4');


    // Detecta el scroll en la ventana y elimina la clase 'out'
    window.addEventListener('scroll', () => {
      if (element.classList.contains('out')) {
        element.classList.remove('out');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (isScrolling) {
      const currentScroll = window.scrollY; // Posición actual del scroll
      const sectionTop = section.offsetTop; // Posición del inicio de la sección
      const sectionBottom = sectionTop + section.offsetHeight;

      // Verificar si estamos dentro del rango de la sección
      if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
        console.log('Desplazamiento completado.');
        isScrolling = false; // Detener la verificación

        // Acción posterior al scroll
       addClass = true;
      }
    }
  });