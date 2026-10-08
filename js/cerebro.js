// ============================================================
// Pagina del cerebro: juego de memoria con SVG propios.
// Juego educativo, no es una prueba clinica de memoria.
// La mejor marca se guarda solo en este dispositivo (localStorage).
// ============================================================

(function () {
  "use strict";

  // 8 iconos propios (trazos simples) usados como figuras del juego.
  var ICONOS = [
    '<path d="M12 3l2.5 5.5L20 9l-4.5 4 1.3 6-4.8-3-4.8 3 1.3-6L4 9l5.5-0.5z" fill="currentColor"/>', // estrella
    '<path d="M16 4a8 8 0 1 0 4 14 9 9 0 1 1-4-14z" fill="currentColor"/>', // luna
    '<circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>', // sol
    '<path d="M12 21c-5-3-8-7-8-11a6 6 0 0 1 11-3 6 6 0 0 1 5 9c-2 3-5 4-8 5z" fill="currentColor"/>', // hoja
    '<path d="M9 18h6M10 21h4M8 10a4 4 0 1 1 8 0c0 2-1.5 3-2 4.5-0.2 0.6-0.3 1-0.3 1.5h-3.4c0-0.5-0.1-0.9-0.3-1.5C9.5 13 8 12 8 10z" fill="currentColor"/>', // foco
    '<path d="M12 3v2M12 19v2M4.2 7l1.7 1M18 16l1.8 1M4.2 17l1.7-1M18 8l1.8-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.6"/>', // engranaje simple
    '<path d="M4 15c3-7 13-7 16 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M4 15v4M20 15v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', // paraguas/nube
    '<path d="M12 21s-7-4.3-7-9.3C5 8.5 7.2 6 10 6.6 11 6.8 11.6 7.5 12 8.3 12.4 7.5 13 6.8 14 6.6 16.8 6 19 8.5 19 11.7 19 16.7 12 21 12 21z" fill="currentColor"/>' // corazon pequeño
  ];

  var tablero = [];
  var cartasVolteadas = [];
  var paresEncontrados = 0;
  var totalPares = 6;
  var movimientos = 0;
  var segundos = 0;
  var cronometro = null;
  var juegoBloqueado = false;
  var nivelActual = "facil";

  document.addEventListener("DOMContentLoaded", function () {
    var botonFacil = document.getElementById("boton-nivel-facil");
    var botonDificil = document.getElementById("boton-nivel-dificil");
    var botonReiniciar = document.getElementById("boton-reiniciar-juego");

    if (!botonFacil) return;

    botonFacil.addEventListener("click", function () {
      nivelActual = "facil";
      iniciarJuego();
    });
    botonDificil.addEventListener("click", function () {
      nivelActual = "dificil";
      iniciarJuego();
    });
    botonReiniciar.addEventListener("click", function () {
      iniciarJuego();
    });

    iniciarJuego();
  });

  function iniciarJuego() {
    totalPares = nivelActual === "facil" ? 6 : 8;
    paresEncontrados = 0;
    movimientos = 0;
    segundos = 0;
    cartasVolteadas = [];
    juegoBloqueado = false;

    window.clearInterval(cronometro);
    actualizarTiempo();
    document.getElementById("contador-movimientos").textContent = "0";
    document.getElementById("mensaje-victoria").textContent = "";
    mostrarMejorMarca();

    var tablero2 = document.getElementById("tablero-memoria");
    tablero2.style.gridTemplateColumns = nivelActual === "facil" ? "repeat(3, 1fr)" : "repeat(4, 1fr)";

    var iconosDelJuego = ICONOS.slice(0, totalPares);
    var mazo = iconosDelJuego.concat(iconosDelJuego);
    mazo = mezclar(mazo);

    tablero2.innerHTML = "";
    tablero = mazo.map(function (icono, indice) {
      var carta = document.createElement("button");
      carta.type = "button";
      carta.className = "tarjeta";
      carta.style.aspectRatio = "1";
      carta.style.display = "flex";
      carta.style.alignItems = "center";
      carta.style.justifyContent = "center";
      carta.style.cursor = "pointer";
      carta.style.minHeight = "60px";
      carta.setAttribute("aria-label", "Carta boca abajo");
      carta.dataset.indice = indice;
      carta.dataset.volteada = "false";
      carta.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px;color:var(--color-primario); visibility:hidden;" aria-hidden="true">' +
        icono +
        "</svg>";

      carta.addEventListener("click", function () {
        voltearCarta(indice);
      });

      tablero2.appendChild(carta);
      return { icono: icono, elemento: carta, encontrada: false };
    });
  }

  function mezclar(arreglo) {
    var copia = arreglo.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temporal = copia[i];
      copia[i] = copia[j];
      copia[j] = temporal;
    }
    return copia;
  }

  function voltearCarta(indice) {
    var carta = tablero[indice];
    if (juegoBloqueado || carta.encontrada || carta.elemento.dataset.volteada === "true") return;
    if (cartasVolteadas.length === 2) return;

    if (segundos === 0 && cartasVolteadas.length === 0 && paresEncontrados === 0) {
      iniciarCronometro();
    }

    carta.elemento.dataset.volteada = "true";
    carta.elemento.querySelector("svg").style.visibility = "visible";
    carta.elemento.setAttribute("aria-label", "Carta volteada");
    cartasVolteadas.push(indice);

    if (cartasVolteadas.length === 2) {
      movimientos += 1;
      document.getElementById("contador-movimientos").textContent = movimientos;
      juegoBloqueado = true;

      var primeraCarta = tablero[cartasVolteadas[0]];
      var segundaCarta = tablero[cartasVolteadas[1]];

      if (primeraCarta.icono === segundaCarta.icono) {
        primeraCarta.encontrada = true;
        segundaCarta.encontrada = true;
        paresEncontrados += 1;
        cartasVolteadas = [];
        juegoBloqueado = false;

        if (paresEncontrados === totalPares) {
          terminarJuego();
        }
      } else {
        window.setTimeout(function () {
          primeraCarta.elemento.dataset.volteada = "false";
          primeraCarta.elemento.querySelector("svg").style.visibility = "hidden";
          primeraCarta.elemento.setAttribute("aria-label", "Carta boca abajo");

          segundaCarta.elemento.dataset.volteada = "false";
          segundaCarta.elemento.querySelector("svg").style.visibility = "hidden";
          segundaCarta.elemento.setAttribute("aria-label", "Carta boca abajo");

          cartasVolteadas = [];
          juegoBloqueado = false;
        }, 800);
      }
    }
  }

  function iniciarCronometro() {
    cronometro = window.setInterval(function () {
      segundos += 1;
      actualizarTiempo();
    }, 1000);
  }

  function actualizarTiempo() {
    var minutos = Math.floor(segundos / 60);
    var segs = segundos % 60;
    var texto =
      (minutos < 10 ? "0" + minutos : minutos) + ":" + (segs < 10 ? "0" + segs : segs);
    document.getElementById("contador-tiempo").textContent = texto;
  }

  function terminarJuego() {
    window.clearInterval(cronometro);
    document.getElementById("mensaje-victoria").textContent =
      "¡Completado en " + movimientos + " movimientos y " + document.getElementById("contador-tiempo").textContent + "!";
    guardarMejorMarca();
  }

  function claveAlmacenamiento() {
    return "miSaludAR_cerebro_mejorMovimientos_" + nivelActual;
  }

  function guardarMejorMarca() {
    var almacen = window.MiSaludAR && window.MiSaludAR.AlmacenSeguro;
    if (!almacen) return;

    var mejorActual = almacen.obtener(claveAlmacenamiento());
    if (!mejorActual || movimientos < parseInt(mejorActual, 10)) {
      almacen.guardar(claveAlmacenamiento(), String(movimientos));
    }
    mostrarMejorMarca();
  }

  function mostrarMejorMarca() {
    var almacen = window.MiSaludAR && window.MiSaludAR.AlmacenSeguro;
    var elemento = document.getElementById("mejor-marca");
    if (!almacen || !elemento) return;

    var mejor = almacen.obtener(claveAlmacenamiento());
    elemento.textContent = mejor ? mejor + " movimientos" : "--";
  }
})();
