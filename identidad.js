(function () {
  "use strict";

  const EMAIL = "guillermosantosanchez@gmail.com";
  const LINKEDIN_URL = "https://www.linkedin.com/in/guillermosant";
  const GITHUB_URL = "https://github.com/guille-ss";
  const CV_URL = "resources/CV.pdf";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ Enlaces globales usados por los botones ============ */
  window.verPDF = function () {
    window.open(CV_URL, "_blank");
  };
  window.verLinkedin = function () {
    window.open(LINKEDIN_URL, "_blank");
  };
  window.verGit = function () {
    window.open(GITHUB_URL, "_blank");
  };

  /* ============ Toast / notificación ============ */
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");
  let toastTimer = null;

  function notify(title, body) {
    if (!toast) return;
    toastTitle.textContent = title;
    toastBody.textContent = body;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function copiarCorreo() {
    navigator.clipboard
      .writeText(EMAIL)
      .then(() => notify("Copiado", "El correo " + EMAIL + " se copió al portapapeles."))
      .catch(() => notify("Aviso", "No se pudo copiar automáticamente. Correo: " + EMAIL));
  }

  document.querySelectorAll(".copy-mail").forEach((el) => {
    el.addEventListener("click", copiarCorreo);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copiarCorreo();
      }
    });
  });

  /* ============ Reloj de sesión ============ */
  const sessionClock = document.getElementById("sessionClock");
  if (sessionClock) {
    const start = Date.now();
    function tick() {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      sessionClock.textContent = h + ":" + m + ":" + s;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============ Marcadores de esquina en paneles ============ */
  document.querySelectorAll(".panel").forEach((panel) => {
    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const span = document.createElement("span");
      span.className = "corner " + pos;
      span.setAttribute("aria-hidden", "true");
      panel.appendChild(span);
    });
  });

  /* ============ Menú móvil ============ */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("mainNav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============ Scrollspy de navegación ============ */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  function updateActiveNav() {
    let current = sections[0];
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ============ Revelado de secciones al hacer scroll ============ */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ============ Botón volver arriba ============ */
  const btnTop = document.getElementById("btnTop");
  if (btnTop) {
    window.addEventListener(
      "scroll",
      () => {
        btnTop.classList.toggle("show", window.scrollY > 420);
      },
      { passive: true }
    );
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ============ Validación del formulario de contacto ============ */
  const form = document.getElementById("contactForm");
  if (form) {
    const rules = {
      nombre: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: (v) => v.trim() === "" || /^[\d\s+()-]{6,}$/.test(v.trim()),
      asunto: (v) => v.trim().length >= 3,
      mensaje: (v) => v.trim().length >= 10,
    };

    function validateField(id) {
      const input = document.getElementById(id);
      const field = input.closest(".field");
      const valid = rules[id](input.value);
      field.classList.toggle("invalid", !valid);
      return valid;
    }

    Object.keys(rules).forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener("blur", () => validateField(id));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(id);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const allValid = Object.keys(rules)
        .map(validateField)
        .every(Boolean);

      if (!allValid) {
        notify("Transmisión rechazada", "Revise los campos marcados antes de continuar.");
        return;
      }

      notify("Transmisión enviada", "Su mensaje ha sido registrado. Responderé a la mayor brevedad.");
      form.reset();
      Object.keys(rules).forEach((id) => {
        document.getElementById(id).closest(".field").classList.remove("invalid");
      });
    });

    form.addEventListener("reset", () => {
      Object.keys(rules).forEach((id) => {
        document.getElementById(id).closest(".field").classList.remove("invalid");
      });
    });
  }
})();