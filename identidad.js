(function () {
  "use strict";

  const EMAIL = "guillermosantosanchez@gmail.com";
  const CV_URL = "resources/CV.pdf";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.verPDF = function () {
    window.open(CV_URL, "_blank");
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

  /* ============ Revelado progresivo de secciones ============ */
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
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ============ Acordeón de casos de estudio (divulgación progresiva) ============ */
  document.querySelectorAll(".case").forEach((caseEl) => {
    const summaryBtn = caseEl.querySelector(".case-summary");
    const body = caseEl.querySelector(".case-body");
    if (!summaryBtn || !body) return;

    summaryBtn.addEventListener("click", () => {
      const isOpen = caseEl.getAttribute("data-open") === "true";
      const next = !isOpen;
      caseEl.setAttribute("data-open", String(next));
      summaryBtn.setAttribute("aria-expanded", String(next));
      body.style.maxHeight = next ? body.scrollHeight + "px" : "0px";
    });
  });

  // Recalcula alturas abiertas si cambia el viewport (imágenes con lazy load, etc.)
  window.addEventListener("resize", () => {
    document.querySelectorAll('.case[data-open="true"] .case-body').forEach((body) => {
      body.style.maxHeight = body.scrollHeight + "px";
    });
  });

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
        notify("Formulario incompleto", "Revisa los campos marcados antes de continuar.");
        return;
      }

      notify("Mensaje enviado", "Gracias por escribir. Responderé a la mayor brevedad.");
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