// ============================================================
// Pagina del corazon: calculadora de frecuencia cardiaca y
// contador de pulso por toque. Todo corre en el navegador.
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    iniciarCalculadoraFC();
    iniciarContadorPulso();
  });

  // --- Calculadora de frecuencia cardiaca maxima y zonas ---
  function iniciarCalculadoraFC() {
    var botonCalcular = document.getElementById("boton-calcular");
    var campoEdad = document.getElementById("campo-edad");
    var resultado = document.getElementById("resultado-fc");
    var valorFcMax = document.getElementById("valor-fcmax");
    var valorModerada = document.getElementById("valor-moderada");
    var valorVigorosa = document.getElementById("valor-vigorosa");

    if (!botonCalcular) return;

    botonCalcular.addEventListener("click", function () {
      var edad = parseInt(campoEdad.value, 10);

      if (!edad || edad < 5 || edad > 110) {
        campoEdad.focus();
        campoEdad.setAttribute("aria-invalid", "true");
        return;
      }
      campoEdad.removeAttribute("aria-invalid");

      // Formula de la American Heart Association: FC max = 220 - edad
      var fcMax = 220 - edad;
      var moderadaBaja = Math.round(fcMax * 0.5);
      var moderadaAlta = Math.round(fcMax * 0.7);
      var vigorosaBaja = Math.round(fcMax * 0.7);
      var vigorosaAlta = Math.round(fcMax * 0.85);

      valorFcMax.textContent = fcMax;
      valorModerada.textContent = moderadaBaja + " y " + moderadaAlta;
      valorVigorosa.textContent = vigorosaBaja + " y " + vigorosaAlta;

      resultado.hidden = false;
      resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // --- Contador de pulso: toca la pantalla con cada latido durante 15s ---
  function iniciarContadorPulso() {
    var botonIniciar = document.getElementById("boton-iniciar-pulso");
    var botonToque = document.getElementById("boton-toque-pulso");
    var segundosRestantesEl = document.getElementById("segundos-restantes");
    var resultadoPulso = document.getElementById("resultado-pulso");

    if (!botonIniciar) return;

    var toques = 0;
    var segundosRestantes = 15;
    var temporizador = null;

    botonIniciar.addEventListener("click", function () {
      toques = 0;
      segundosRestantes = 15;
      resultadoPulso.textContent = "";
      segundosRestantesEl.textContent = segundosRestantes;

      botonIniciar.hidden = true;
      botonToque.hidden = false;
      botonToque.disabled = false;

      temporizador = window.setInterval(function () {
        segundosRestantes -= 1;
        segundosRestantesEl.textContent = segundosRestantes;

        if (segundosRestantes <= 0) {
          window.clearInterval(temporizador);
          botonToque.hidden = true;
          botonIniciar.hidden = false;
          botonIniciar.textContent = "Volver a intentar";

          var latidosPorMinuto = toques * 4;
          resultadoPulso.textContent =
            "Tu pulso aproximado es de " + latidosPorMinuto + " latidos por minuto.";
        }
      }, 1000);
    });

    botonToque.addEventListener("click", function () {
      toques += 1;
    });
  }
})();
