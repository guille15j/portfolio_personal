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