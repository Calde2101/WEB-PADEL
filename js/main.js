/* =========================
   PCA PÁDEL CLUB - MAIN JS
========================= */

document.addEventListener("DOMContentLoaded", () => {
    initAOS();
    initMobileMenu();
    initHeroSlider();
    initCounters();
    initMap();
    initSmoothScroll();
    initNavScroll();
    initContactForm();
    initScrollProgress();
    initClaseTabs();
    initClaseConfigurator();
    initCountdown();
    initTilt();
});


/* =========================
   AOS ANIMATIONS
========================= */

function initAOS() {
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            once: true,
            offset: 90,
            easing: "ease-out-cubic"
        });
    }
}


/* =========================
   MENÚ MÓVIL
========================= */

function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const body = document.body;

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        body.classList.toggle("menu-open", isOpen);
        menuToggle.classList.toggle("active", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            body.classList.remove("menu-open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            navLinks.classList.remove("active");
            body.classList.remove("menu-open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================
   HERO SLIDER
========================= */

function initHeroSlider() {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length) return;

    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add("active");
    }, 5200);
}


/* =========================
   CONTADORES ANIMADOS
========================= */

function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const animateCounter = counter => {
        const target = Number(counter.dataset.target || 0);
        const duration = 1400;
        const startTime = performance.now();

        const update = currentTime => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(easedProgress * target);

            counter.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;

            if (counter.dataset.animated === "true") return;

            counter.dataset.animated = "true";
            animateCounter(counter);
            observer.unobserve(counter);
        });
    }, {
        threshold: 0.45
    });

    counters.forEach(counter => observer.observe(counter));
}


/* =========================
   MAPA LEAFLET
========================= */

function initMap() {
    const mapElement = document.getElementById("map");

    if (!mapElement || typeof L === "undefined") return;

    const coords = [40.3008, -3.4380];

    const map = L.map(mapElement, {
        scrollWheelZoom: false
    }).setView(coords, 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    L.marker(coords)
        .addTo(map)
        .bindPopup("<strong>PCA Pádel Club Arganda</strong><br>Instalaciones municipales de Arganda del Rey")
        .openPopup();
}


/* =========================
   SCROLL SUAVE
========================= */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const href = anchor.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================
   NAV AL HACER SCROLL
========================= */

function initNavScroll() {

    const nav = document.querySelector(".nav");

    if (!nav) return;

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateNav = () => {

        nav.classList.toggle("scrolled", window.scrollY > 80);

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 180;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }

        });

    };

    updateNav();

    window.addEventListener("scroll", updateNav, {
        passive: true
    });

}


/* =========================
   FORMULARIO DE CONTACTO
========================= */

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !message) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const subject = encodeURIComponent(`Contacto web PCA - ${name}`);
        const body = encodeURIComponent(
            `Nombre: ${name}\n` +
            `Email: ${email}\n\n` +
            `Mensaje:\n${message}`
        );

        // Cambia este correo por el real del club
        const clubEmail = "padelclubarganda@gmail.com";

        window.location.href = `mailto:${clubEmail}?subject=${subject}&body=${body}`;
    });
}


/* =========================
   BARRA DE PROGRESO SCROLL
========================= */

function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    const update = () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = height > 0 ? (scrollTop / height) * 100 : 0;
        bar.style.width = `${progress}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
}


/* =========================
   TABS DE CLASES
========================= */

function initClaseTabs() {
    const tabs = document.querySelectorAll(".clase-tab");
    const panels = document.querySelectorAll(".clase-panel");
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => {
                const isActive = t === tab;
                t.classList.toggle("active", isActive);
                t.setAttribute("aria-selected", String(isActive));
            });

            panels.forEach(panel => {
                panel.classList.toggle("active", panel.dataset.panel === target);
            });
        });
    });
}


/* =========================
   CONFIGURADOR DE CLASES
========================= */

function initClaseConfigurator() {
    const form = document.getElementById("claseForm");
    if (!form) return;

    const opciones = {
        pista: [
            { label: "Iniciación", price: 12 },
            { label: "Perfeccionamiento", price: 15 },
            { label: "Clase individual", price: 30 },
            { label: "Tecnificación competición", price: 20 },
            { label: "Escuela infantil", price: 10 },
            { label: "Clase en pareja", price: 18 }
        ],
        fisico: [
            { label: "Preparación física pádel", price: 12 },
            { label: "Prevención de lesiones", price: 12 },
            { label: "Fuerza y potencia", price: 14 },
            { label: "Resistencia y agilidad", price: 12 },
            { label: "Entrenamiento personal 1:1", price: 28 },
            { label: "Bono mensual físico", price: 90 }
        ]
    };

    const modalidad = document.getElementById("modalidad");
    const tipo = document.getElementById("tipo");
    const nivel = document.getElementById("nivel");
    const formato = document.getElementById("formato");
    const frecuencia = document.getElementById("frecuencia");
    const franja = document.getElementById("franja");

    const sumTipo = document.getElementById("sumTipo");
    const sumMod = document.getElementById("sumMod");
    const sumNivel = document.getElementById("sumNivel");
    const sumFormato = document.getElementById("sumFormato");
    const sumDias = document.getElementById("sumDias");
    const sumFrec = document.getElementById("sumFrec");
    const sumPrice = document.getElementById("sumPrice");

    const fillTipos = mod => {
        tipo.innerHTML = "";
        opciones[mod].forEach(o => {
            const opt = document.createElement("option");
            opt.value = o.label;
            opt.textContent = o.label;
            opt.dataset.price = o.price;
            tipo.appendChild(opt);
        });
    };

    const updateSummary = () => {
        const selectedTipo = tipo.options[tipo.selectedIndex];
        const base = Number(selectedTipo?.dataset.price || 0);
        const mult = Number(formato.options[formato.selectedIndex]?.dataset.mult || 1);
        const freq = Number(frecuencia.value || 1);

        const isBono = /bono/i.test(tipo.value);
        // Estimación mensual: precio * formato * (frecuencia * 4 semanas), salvo bonos ya mensuales
        const monthly = isBono ? base : Math.round(base * mult * freq * 4);

        const dias = Array.from(form.querySelectorAll('input[name="dia"]:checked')).map(d => d.value);

        sumTipo.textContent = tipo.value || "—";
        sumMod.textContent = modalidad.value === "pista" ? "En pista" : "Físico";
        sumNivel.textContent = nivel.value;
        sumFormato.textContent = formato.options[formato.selectedIndex].text;
        sumDias.textContent = dias.length ? dias.map(d => d.slice(0, 3)).join(", ") : "—";
        sumFrec.textContent = frecuencia.options[frecuencia.selectedIndex].text;
        sumPrice.textContent = monthly;
    };

    modalidad.addEventListener("change", () => {
        fillTipos(modalidad.value);
        updateSummary();
    });

    form.addEventListener("change", updateSummary);

    // Botones "Elegir" de las tarjetas
    document.querySelectorAll(".clase-pick").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".clase-card");
            const mod = btn.dataset.mod || "pista";
            const claseName = card?.dataset.clase;

            modalidad.value = mod;
            fillTipos(mod);

            if (claseName) {
                const match = Array.from(tipo.options).find(o => o.value === claseName);
                if (match) tipo.value = claseName;
            }

            updateSummary();
            document.getElementById("reservar-clase")
                .scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });

    // Envío del formulario -> mailto
    form.addEventListener("submit", event => {
        event.preventDefault();

        const data = new FormData(form);
        const name = String(data.get("cname") || "").trim();
        const email = String(data.get("cemail") || "").trim();
        const phone = String(data.get("cphone") || "").trim();

        if (!name || !email || !phone) {
            alert("Por favor, completa nombre, teléfono y email.");
            return;
        }

        const dias = Array.from(form.querySelectorAll('input[name="dia"]:checked'))
            .map(d => d.value).join(", ") || "Sin preferencia";

        const subject = encodeURIComponent(`Solicitud de clase PCA - ${name}`);
        const body = encodeURIComponent(
            `Nueva solicitud de clase/entrenamiento:\n\n` +
            `Nombre: ${name}\n` +
            `Teléfono: ${phone}\n` +
            `Email: ${email}\n\n` +
            `Modalidad: ${sumMod.textContent}\n` +
            `Tipo: ${tipo.value}\n` +
            `Nivel: ${nivel.value}\n` +
            `Formato: ${formato.options[formato.selectedIndex].text}\n` +
            `Días: ${dias}\n` +
            `Franja: ${franja.value}\n` +
            `Frecuencia: ${frecuencia.options[frecuencia.selectedIndex].text}\n` +
            `Estimado: ${sumPrice.textContent}€/mes\n`
        );

        const clubEmail = "padelclubarganda@gmail.com";
        window.location.href = `mailto:${clubEmail}?subject=${subject}&body=${body}`;
    });

    fillTipos(modalidad.value);
    updateSummary();
}


/* =========================
   CUENTA ATRÁS TORNEO
========================= */

function initCountdown() {
    const countdown = document.querySelector(".countdown");
    if (!countdown) return;

    const deadline = new Date(countdown.dataset.deadline).getTime();
    if (Number.isNaN(deadline)) return;

    const elDays = countdown.querySelector('[data-cd="days"]');
    const elHours = countdown.querySelector('[data-cd="hours"]');
    const elMinutes = countdown.querySelector('[data-cd="minutes"]');
    const elSeconds = countdown.querySelector('[data-cd="seconds"]');

    const pad = n => String(n).padStart(2, "0");

    const tick = () => {
        const diff = deadline - Date.now();

        if (diff <= 0) {
            [elDays, elHours, elMinutes, elSeconds].forEach(el => { if (el) el.textContent = "00"; });
            clearInterval(timer);
            return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (elDays) elDays.textContent = pad(days);
        if (elHours) elHours.textContent = pad(hours);
        if (elMinutes) elMinutes.textContent = pad(minutes);
        if (elSeconds) elSeconds.textContent = pad(seconds);
    };

    tick();
    const timer = setInterval(tick, 1000);
}


/* =========================
   EFECTO TILT + GLOW
========================= */

function initTilt() {
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll(".tilt");

    cards.forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 8;
            const rotateX = ((y / rect.height) - 0.5) * -8;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
            card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}
