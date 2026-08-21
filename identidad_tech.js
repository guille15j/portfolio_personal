(function () {
  "use strict";

  const EMAIL = "guillermosantosanchez@gmail.com";
  const CV_URL = "resources/CV.pdf";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.verPDF = function () {
    window.open(CV_URL, "_blank", "noopener,noreferrer");
  };

  /* ============ LIENZO INTERACTIVO DE TELEMETRÍA (ESPACIO + ÁTOMOS) ============ */
  function initTelemetryCanvas() {
    const canvas = document.getElementById("telemetryCanvas");
    if (!canvas || prefersReducedMotion) return;

    canvas.setAttribute("aria-hidden", "true");

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function getParticleCount(screenWidth) {
      return Math.min(320, Math.max(90, Math.floor(screenWidth / 8)));
    }

    function createParticles(count) {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        const domain = i % 5;
        const isHub = i % 9 === 0;
        const isOrbital = i > count * 0.82;

        const phi = Math.acos(1 - (2 * (i + 0.5)) / (count * 0.82));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const ringAngle = i * 0.15;
        const ringRadius = 1.6 + (i % 3) * 0.1;

        newParticles.push({
          i: i,
          domain: domain,
          isHub: isHub,
          isOrbital: isOrbital,
          baseX: isOrbital ? Math.cos(ringAngle) * ringRadius : Math.sin(phi) * Math.cos(theta),
          baseY: isOrbital ? Math.sin(ringAngle * 0.5) * 0.25 : Math.sin(phi) * Math.sin(theta),
          baseZ: isOrbital ? Math.sin(ringAngle) * ringRadius : Math.cos(phi),
          size: isHub ? 3.2 : 1.2 + (i % 4) * 0.4,
          orbitSpeed: 0.08 + (i % 5) * 0.04
        });
      }
      return newParticles;
    }

    let NUM_PARTICLES = getParticleCount(width);
    let particles = createParticles(NUM_PARTICLES);
    let time = 0;

    let mouse = { x: width / 2, y: height / 2, active: false };

    let currentProgress = 0;
    let targetProgress = 0;

    const incomingPulses = [];
    const MAX_INCOMING_PULSES = 16;

    const sections = [
      { id: "top" },
      { id: "sobre-mi" },
      { id: "casos" },
      { id: "registro" },
      { id: "contacto" }
    ];

    function smoothstep(min, max, value) {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    }

    function getScrollProgress() {
      const vh = window.innerHeight;
      const els = sections.map(sec => document.getElementById(sec.id)).filter(Boolean);

      if (els.length === 0 || els[0].getBoundingClientRect().top > 0) return 0;

      for (let i = 0; i < els.length; i++) {
        const rect = els[i].getBoundingClientRect();
        const nextEl = els[i + 1];

        if (rect.top <= vh * 0.5 && rect.bottom >= 0) {
          if (!nextEl) return i;
          const dist = nextEl.getBoundingClientRect().top - rect.top;
          if (dist <= 0) return i;
          return i + Math.max(0, Math.min(1, (vh * 0.5 - rect.top) / dist));
        }
      }
      return sections.length - 1;
    }

    function spawnIncomingPulse(projected, baseRadius, cx, cy) {
      const side = Math.random() > 0.5 ? "left" : "right";
      const borderCandidates = [];

      projected.forEach((p, idx) => {
        if (idx < NUM_PARTICLES * 0.82) {
          const distToCenter = Math.hypot(p.x - cx, p.y - cy);
          const isOuterBorder = distToCenter >= baseRadius * 0.70;
          const isCorrectSide = side === "left" ? p.x <= cx + baseRadius * 0.1 : p.x >= cx - baseRadius * 0.1;

          if (isOuterBorder && isCorrectSide) borderCandidates.push(idx);
        }
      });

      if (borderCandidates.length === 0) return;

      const targetIdx = borderCandidates[Math.floor(Math.random() * borderCandidates.length)];
      const curveHeight = (Math.random() - 0.5) * height * 0.4;

      incomingPulses.push({
        side: side,
        targetIdx: targetIdx,
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        curveHeight: curveHeight,
        hue: 185 + Math.random() * 30
      });
    }

    // window.addEventListener("mousemove", (e) => {
    //   mouse.x = e.clientX;
    //   mouse.y = e.clientY;
    //   mouse.active = true;
    // }, { passive: true });

    // window.addEventListener("mouseleave", () => {
    //   mouse.active = false;
    // });

    function render() {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      targetProgress = getScrollProgress();
      currentProgress += (targetProgress - currentProgress) * 0.05;
      const progress = currentProgress;

      const cx = width / 2;
      const cy = height / 2;

      const heroFactor = 1 - smoothstep(0.0, 0.8, progress);

      const heroAtmosphereAlpha = 1 - smoothstep(0.0, 1.2, progress);
      if (heroAtmosphereAlpha > 0) {
        const auraRadius = Math.min(width, height) * 0.42;
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, auraRadius);
        gradient.addColorStop(0, `rgba(0, 240, 255, ${0.18 * heroAtmosphereAlpha})`);
        gradient.addColorStop(0.4, `rgba(47, 90, 255, ${0.1 * heroAtmosphereAlpha})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      const breath = Math.sin(time * 0.8) * 8;
      const maxSphereRadius = Math.min(width, height) * 0.28;
      const baseRadius = maxSphereRadius + breath;
      const cameraZShift = progress * 45;

      const cosR = Math.cos(time * 0.06);
      const sinR = Math.sin(time * 0.06);

      const orbitalWeight = 1 - smoothstep(0.0, 0.4, progress);
      const projected = [];

      particles.forEach((p) => {
        const distanceToActiveSection = Math.abs(progress - p.domain);
        const activation = Math.max(0, 1 - distanceToActiveSection * 0.85);

        const expansion = 1 + activation * 0.25;
        const currentRadius = baseRadius * (1 + progress * 0.15) * expansion;

        const sphereX = p.baseX * currentRadius;
        const sphereY = p.baseY * currentRadius;
        const sphereZ = p.baseZ * currentRadius - cameraZShift;

        let x3d = sphereX;
        let y3d = sphereY;
        let z3d = sphereZ;

        if (p.isOrbital && orbitalWeight > 0) {
          const orbitAngle = time * p.orbitSpeed * 3 + p.i;
          const r = baseRadius * (1.18 + Math.sin(time * 0.5 + p.i) * 0.04);
          const orbX = Math.cos(orbitAngle) * r;
          const orbY = Math.sin(orbitAngle * 0.3) * (r * 0.35);
          const orbZ = Math.sin(orbitAngle) * r;

          x3d = orbX * orbitalWeight + sphereX * (1 - orbitalWeight);
          y3d = orbY * orbitalWeight + sphereY * (1 - orbitalWeight);
          z3d = orbZ * orbitalWeight + sphereZ * (1 - orbitalWeight);
        }

        x3d += Math.sin(time * 1.1 + p.i) * (1.2 + activation * 2.0);
        y3d += Math.cos(time * 0.9 + p.i) * (1.2 + activation * 2.0);

        const rx = x3d * cosR - z3d * sinR;
        const rz = x3d * sinR + z3d * cosR;

        const fov = 420;
        const safeZ = Math.max(-260, rz);
        const scale = fov / (fov + safeZ + 320);

        let screenX = cx + rx * scale;
        let screenY = cy + y3d * scale;

        if (mouse.active) {
          const dx = mouse.x - screenX;
          const dy = mouse.y - screenY;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 0) {
            const pull = (1 - dist / 180) * 14;
            screenX += (dx / dist) * pull;
            screenY += (dy / dist) * pull;
          }
        }

        projected.push({
          x: screenX,
          y: screenY,
          scale: scale,
          activation: activation,
          domain: p.domain,
          isHub: p.isHub,
          baseSize: p.size
        });
      });

      ctx.globalCompositeOperation = "lighter";

      if (progress < 0.15 && incomingPulses.length < MAX_INCOMING_PULSES && Math.random() < 0.12) {
        spawnIncomingPulse(projected, baseRadius, cx, cy);
      }

      const leftAnchor = { x: 0, y: cy };
      const rightAnchor = { x: width, y: cy };

      for (let k = incomingPulses.length - 1; k >= 0; k--) {
        const pulse = incomingPulses[k];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          incomingPulses.splice(k, 1);
          continue;
        }

        const start = pulse.side === "left" ? leftAnchor : rightAnchor;
        const target = projected[pulse.targetIdx];

        if (!target) continue;

        const controlX = (start.x + target.x) / 2;
        const controlY = (start.y + target.y) / 2 + pulse.curveHeight;

        const t = pulse.progress;
        const invT = 1 - t;
        const px = invT * invT * start.x + 2 * invT * t * controlX + t * t * target.x;
        const py = invT * invT * start.y + 2 * invT * t * controlY + t * t * target.y;

        const pulseAlpha = Math.sin(t * Math.PI) * 0.85 * heroFactor;

        if (pulseAlpha > 0.005) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(controlX, controlY, target.x, target.y);
          ctx.strokeStyle = `hsla(${pulse.hue}, 85%, 60%, ${pulseAlpha * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${pulse.hue}, 100%, 90%, ${pulseAlpha})`;
          ctx.fill();
        }
      }

      const baseConnectDist = 52 + progress * 10;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < baseConnectDist) {
            const linkActivation = Math.max(p1.activation, p2.activation);
            const alpha = (1 - dist / baseConnectDist) * (0.16 + linkActivation * 0.45) * Math.min(p1.scale, 1);
            const hue = 190 + linkActivation * 40;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${alpha})`;
            ctx.lineWidth = linkActivation > 0.6 || (p1.isHub && p2.isHub) ? 1.2 : 0.6;
            ctx.stroke();
          }
        }
      }

      projected.forEach((p) => {
        const sizeBoost = 1 + p.activation * 1.2;
        const radius = Math.max(1.0, p.baseSize * sizeBoost * p.scale);
        const alpha = Math.min(1, (0.35 + p.activation * 0.65) * p.scale);
        const hue = 190 + p.activation * 45;

        if (p.isHub || p.activation > 0.35) {
          const glowRadius = radius * (2.0 + Math.sin(time * 1.8 + p.domain) * 0.3);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${alpha})`;
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(render);
    }

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const newCount = getParticleCount(width);
        if (newCount !== NUM_PARTICLES) {
          NUM_PARTICLES = newCount;
          particles = createParticles(NUM_PARTICLES);
          incomingPulses.length = 0;
        }
      }, 100);
    });

    render();
  }

  /* ============ BORDE LUMINOSO MAGNÉTICO (MOUSE TRACKING) ============ */
  function initMagneticBorders() {
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll(".blueprint-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }, { passive: true });
    });
  }

  /* ============ TOAST / NOTIFICACIONES ============ */
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(EMAIL)
        .then(() => notify("Copiado", "El correo " + EMAIL + " se copió al portapapeles."))
        .catch(() => notify("Aviso", "No se pudo copiar automáticamente. Correo: " + EMAIL));
    } else {
      notify("Aviso", "No se pudo copiar automáticamente. Correo: " + EMAIL);
    }
  }

  document.querySelectorAll(".copy-mail").forEach((el) => {
    el.addEventListener("click", copiarCorreo);
  });

  /* ============ SCROLL DE CTAS ============ */
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll-to");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  });

  /* ============ BOTÓN VER CV ============ */
  const cvButton = document.getElementById("cvButton");
  if (cvButton) {
    cvButton.addEventListener("click", verPDF);
  }

  /* ============ MENÚ MÓVIL ============ */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("mainNav");

  if (burger && nav) {
    function setMenu(open) {
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }

    burger.addEventListener("click", () => {
      setMenu(!nav.classList.contains("open"));
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        burger.focus();
      }
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
      });
    });
  }

  /* ============ REVELADO POR SCROLL ============ */
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
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ============ ACORDEÓN DE PROYECTOS ============ */
  document.querySelectorAll(".case").forEach((caseEl) => {
    const summaryBtn = caseEl.querySelector(".case-summary");
    const body = caseEl.querySelector(".case-body");
    if (!summaryBtn || !body) return;

    function setCaseOpen(open) {
      caseEl.setAttribute("data-open", String(open));
      summaryBtn.setAttribute("aria-expanded", String(open));
      body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
    }

    summaryBtn.addEventListener("click", () => {
      const next = caseEl.getAttribute("data-open") !== "true";
      setCaseOpen(next);
    });

    summaryBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const next = caseEl.getAttribute("data-open") !== "true";
        setCaseOpen(next);
      }
    });
  });

  /* ============ BOTÓN VOLVER ARRIBA ============ */
  const btnTop = document.getElementById("btnTop");
  if (btnTop) {
    window.addEventListener(
      "scroll",
      () => {
        btnTop.classList.toggle("show", window.scrollY > 400);
      },
      { passive: true }
    );

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ============ VALIDACIÓN DE FORMULARIO ============ */
  const form = document.getElementById("contactForm");
  if (form) {
    const rules = {
      nombre: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: (v) => v.trim() === "" || /^[\d\s+()-]{6,}$/.test(v.trim()),
      asunto: (v) => v.trim().length >= 3,
      mensaje: (v) => v.trim().length >= 10
    };

    function validateField(id) {
      const input = document.getElementById(id);
      if (!input) return true;

      const field = input.closest(".field");
      const valid = rules[id](input.value);

      field.classList.toggle("invalid", !valid);

      if (valid) {
        input.removeAttribute("aria-invalid");
      } else {
        input.setAttribute("aria-invalid", "true");
      }

      return valid;
    }

    Object.keys(rules).forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("blur", () => validateField(id));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(id);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const allValid = Object.keys(rules)
        .map(validateField)
        .every(Boolean);

      if (!allValid) {
        notify("Formulario incompleto", "Revisa los campos marcados antes de enviar.");

        const firstInvalid = Object.keys(rules)
          .map((id) => document.getElementById(id))
          .find((input) => input && input.getAttribute("aria-invalid") === "true");

        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Leemos los valores ANTES de resetear nada
      const now = new Date();
      const data = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        asunto: form.asunto.value.trim(),
        mensaje: form.mensaje.value.trim(),
        date: now.toLocaleDateString("es-ES"),
        time: now.toLocaleTimeString("es-ES"),
      };

      try {
        const response = await emailjs.send(import.meta.env.VITE_GMAIL_ID_EMAILJS, import.meta.env.VITE_TEMPLATED_ID_EMAILJS, data);
        if (response.status !== 200) throw new Error("EmailJS status " + response.status);
      } catch (err) {
        console.error("EmailJS error:", err);
        notify("Error al enviar", "No se pudo enviar el mensaje. Inténtalo de nuevo.");
        return;
      }

      notify("Mensaje enviado", "Gracias por escribir. Responderé lo más pronto posible.");
      form.reset();
      Object.keys(rules).forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.closest(".field").classList.remove("invalid");
          el.removeAttribute("aria-invalid");
        }
      });
    });

    form.addEventListener("reset", () => {
      requestAnimationFrame(() => {
        Object.keys(rules).forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.closest(".field").classList.remove("invalid");
            el.removeAttribute("aria-invalid");
          }
        });
      });
    });
  }

  /* ============ INICIALIZACIÓN GENERAL ============ */
  document.addEventListener("DOMContentLoaded", () => {
    initTelemetryCanvas();
    initLiveMetrics();
    initMagneticBorders();
  });
})();



(function () {
  "use strict";

  const TITULOS_FOLDER = "/resources/titulos/";
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

  function buildCard(entry) {
    const isPdf = /\.pdf$/i.test(entry.file);
    const thumbSrc = entry.thumb || (isPdf ? null : entry.file);

    const card = document.createElement("a");
    card.className = "titulo-card";
    card.href = TITULOS_FOLDER + encodeURI(entry.file);
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const caption = document.createElement("span");
    caption.className = "titulo-caption";
    caption.textContent = entry.file.replace(/\.[^/.]+$/, "");

    if (isPdf) {
      const badge = document.createElement("span");
      badge.className = "titulo-badge";
      badge.textContent = "PDF";
      card.appendChild(badge);
    }

    if (!thumbSrc) {
      const broken = document.createElement("div");
      broken.className = "titulo-broken";
      broken.innerHTML = svgNoImageIcon() + '<span>Sin vista previa</span>';
      card.classList.add("titulo-card--broken");
      card.appendChild(broken);
      card.appendChild(caption);
      return card;
    }

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "titulo-img-wrapper";

    const img = document.createElement("img");
    img.src = TITULOS_FOLDER + encodeURI(thumbSrc);
    img.alt = caption.textContent;
    img.loading = "lazy";
    img.onerror = function () { showBrokenState(card, img); };

    imgWrapper.appendChild(img);
    card.appendChild(imgWrapper);
    card.appendChild(caption);
    return card;
  }

  function renderCards(track, entries) {
    track.innerHTML = "";
    track.classList.remove("is-marquee");
    entries.forEach((entry) => track.appendChild(buildCard(entry)));
  }

  function cloneCardWithHandlers(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll("img").forEach((img) => {
      img.onerror = function () { showBrokenState(clone, img); };
    });
    return clone;
  }

  function evaluateOverflow(viewport, track, originalFiles) {
    const singleSetWidth = track.classList.contains("is-marquee")
      ? track.scrollWidth / 2
      : track.scrollWidth;

    const overflows = singleSetWidth > viewport.clientWidth;

    if (overflows && !track.classList.contains("is-marquee")) {
      Array.from(track.children)
        .map(cloneCardWithHandlers)
        .forEach((clone) => track.appendChild(clone));

      track.classList.add("is-marquee");
      const duration = Math.max(18, Math.round(singleSetWidth / 40));
      track.style.setProperty("--marquee-duration", duration + "s");
    } else if (!overflows && track.classList.contains("is-marquee")) {
      renderCards(track, originalFiles);
      track.style.removeProperty("--marquee-duration");
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

    let resizeBound = false;

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

        if (!resizeBound) {
          resizeBound = true;
          window.addEventListener(
            "resize",
            debounce(() => evaluateOverflow(viewport, track, files), 200)
          );
        }
      })
      .catch(() => renderPlaceholder(track));
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTitulosCarousel("titulosViewport", "titulosTrack");
  });
})();

function getAnonId() {
  const existing = document.cookie.match(/anonId=([^;]+)/)?.[1];
  if (existing) return existing;

  const newId = crypto.randomUUID();
  document.cookie = `anonId=${newId}; path=/; max-age=31536000`;
  return newId;
}

async function registrarVisita() {
  const anonId = getAnonId();
  const hora = new Date().toISOString();
  let comunidad = "Desconocida";

  try {
    const geoRes = await fetch("https://ipapi.co/json/");
    if (geoRes.ok) {
      const geo = await geoRes.json();
      comunidad = geo.region || "Desconocida";
    }
  } catch (e) {}

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonId,
        hora,
        comunidad,
        userAgent: navigator.userAgent
      })
    });
  } catch (err) {
    console.error("Error registrando visita:", err);
  }
}


// registrarVisita();
emailjs.init(import.meta.env.VITE_EMAILJS_ID);
