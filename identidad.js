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


(function () {
  "use strict";

  const TITULOS_FOLDER = "resources/titulos/";
  const TITULOS_MANIFEST = TITULOS_FOLDER + "manifest.json";

  function getContainer(id) {
    return document.getElementById(id);
  }

  function renderPlaceholder(track) {
    track.innerHTML = "";
    track.classList.remove("is-marquee");
    const placeholder = document.createElement("div");
    placeholder.className = "titulos-placeholder";
    placeholder.textContent = "Work in progress — títulos en camino.";
    track.appendChild(placeholder);
  }

  function buildCard(entry) {
  const isPdf = /\.pdf$/i.test(entry.file);
  const thumbSrc = entry.thumb || (isPdf ? null : entry.file);

  const card = document.createElement("a");
  card.className = "titulo-card";
  card.href = TITULOS_FOLDER + entry.file;
  card.target = "_blank";
  card.rel = "noopener";

  const caption = document.createElement("figcaption");
  caption.className = "titulo-caption";
  caption.textContent = entry.file.replace(/\.[^/.]+$/, "");

  if (isPdf) {
    const badge = document.createElement("span");
    badge.className = "titulo-badge";
    badge.textContent = "PDF";
    card.appendChild(badge);
  }

  if (!thumbSrc) {
    // PDF declarado sin miniatura: directamente sin vista previa
    const broken = document.createElement("div");
    broken.className = "titulo-broken";
    broken.innerHTML = svgNoImageIcon() + '<span>Sin vista previa</span>';
    card.classList.add("titulo-card--broken");
    card.appendChild(broken);
    card.appendChild(caption);
    return card;
  }

  const img = document.createElement("img");
  img.src = TITULOS_FOLDER + thumbSrc;
  img.alt = entry.file;
  img.loading = "lazy";
  img.onerror = function () { showBrokenState(card, img); };

  card.appendChild(img);
  card.appendChild(caption);
  return card;
}

  function svgNoImageIcon() {
    return `
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="4" y="8" width="40" height="32" rx="3" stroke="currentColor" stroke-width="2"/>
        <circle cx="16" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M6 34l10-10 7 7 6-6 13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 6l36 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  function showBrokenState(card, imgEl) {
    card.classList.add("titulo-card--broken");
    imgEl.remove();
    const broken = document.createElement("div");
    broken.className = "titulo-broken";
    broken.innerHTML = svgNoImageIcon() + '<span>Sin vista previa</span>';
    card.prepend(broken);
  }

  function renderCards(track, entries) {
  track.innerHTML = "";
  track.classList.remove("is-marquee");
  entries.forEach((entry) => track.appendChild(buildCard(entry)));
}

  function evaluateOverflow(viewport, track, originalFiles) {
    const singleSetWidth = track.classList.contains("is-marquee")
      ? track.scrollWidth / 2
      : track.scrollWidth;

    const overflows = singleSetWidth > viewport.clientWidth;

    if (overflows && !track.classList.contains("is-marquee")) {
      // Duplicamos el set una vez para que el bucle infinito no dé salto
      Array.from(track.children)
        .map((n) => n.cloneNode(true))
        .forEach((clone) => track.appendChild(clone));
      track.classList.add("is-marquee");
      const duration = Math.max(18, Math.round(singleSetWidth / 40));
      track.style.setProperty("--marquee-duration", duration + "s");
    } else if (!overflows && track.classList.contains("is-marquee")) {
      renderCards(track, originalFiles); // ya cabe: quitamos duplicados
    }
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function initTitulosCarousel(viewportId, trackId) {
    const viewport = getContainer(viewportId);
    const track = getContainer(trackId);
    if (!viewport || !track) return;

    fetch(TITULOS_MANIFEST, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("manifest no encontrado");
        return res.json();
      })
      .then((files) => {
        if (!Array.isArray(files) || files.length === 0) {
          renderPlaceholder(track);
          return;
        }
        renderCards(track, files);
        requestAnimationFrame(() => evaluateOverflow(viewport, track, files));
        window.addEventListener(
          "resize",
          debounce(() => evaluateOverflow(viewport, track, files), 200)
        );
      })
      .catch(() => renderPlaceholder(track));
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTitulosCarousel("titulosViewport", "titulosTrack");
  });
})();