// ============================================================
// Mi Salud AR - Utilidades compartidas por todas las paginas
// Menu movil, animaciones al hacer scroll y helpers de localStorage.
// ============================================================

(function () {
  "use strict";

  // --- Menu de navegacion para movil ---
  function iniciarMenu() {
    var boton = document.querySelector(".boton-menu");
    var menu = document.querySelector(".menu-nav");
    if (!boton || !menu) return;

    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    // Cierra el menu al elegir una opcion (en vista movil)
    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
        boton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Animacion sutil al hacer scroll (respeta prefers-reduced-motion) ---
  function iniciarAnimacionScroll() {
    var elementos = document.querySelectorAll(".al-hacer-scroll");
    if (!elementos.length) return;

    var prefiereReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefiereReducido || !("IntersectionObserver" in window)) {
      elementos.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elementos.forEach(function (el) {
      observador.observe(el);
    });
  }

  // --- Acceso seguro a localStorage (puede fallar en modo privado) ---
  var AlmacenSeguro = {
    obtener: function (clave) {
      try {
        return window.localStorage.getItem(clave);
      } catch (error) {
        return null;
      }
    },
    guardar: function (clave, valor) {
      try {
        window.localStorage.setItem(clave, valor);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  // Se expone para que los scripts de cada organo lo reutilicen
  window.MiSaludAR = window.MiSaludAR || {};
  window.MiSaludAR.AlmacenSeguro = AlmacenSeguro;

  document.addEventListener("DOMContentLoaded", function () {
    iniciarMenu();
    iniciarAnimacionScroll();
  });
})();
