// ============================================================
// Pagina de pulmones: cuestionario de habitos respiratorios
// y ejercicio de respiracion guiada. Todo corre en el navegador,
// no se envia ni guarda ningun dato de salud.
// ============================================================

(function () {
  "use strict";

  // Cada pregunta tiene opciones con un puntaje de riesgo (0 = favorable).
  // "alerta: true" marca una respuesta que amerita recomendar consulta medica.
  var PREGUNTAS = [
    {
      texto: "¿Fumas actualmente?",
      clave: "fuma",
      opciones: [
        { texto: "Sí", puntos: 3 },
        { texto: "Dejé de fumar", puntos: 1 },
        { texto: "No", puntos: 0 }
      ]
    },
    {
      texto: "¿Convives frecuentemente con el humo de tabaco de otras personas (humo de segunda mano)?",
      clave: "humoSegunda",
      opciones: [
        { texto: "Sí", puntos: 2 },
        { texto: "No", puntos: 0 }
      ]
    },
    {
      texto: "¿En tu casa se usa leña o biomasa para cocinar o calentar?",
      clave: "lena",
      opciones: [
        { texto: "Sí, frecuentemente", puntos: 3 },
        { texto: "A veces", puntos: 1 },
        { texto: "No", puntos: 0 }
      ]
    },
    {
      texto: "¿Haces actividad física con regularidad?",
      clave: "ejercicio",
      opciones: [
        { texto: "Sí", puntos: 0 },
        { texto: "No", puntos: 2 }
      ]
    },
    {
      texto: "¿Estás al día con tus vacunas contra influenza y neumococo?",
      clave: "vacunas",
      opciones: [
        { texto: "Sí", puntos: 0 },
        { texto: "No lo sé", puntos: 1 },
        { texto: "No", puntos: 2 }
      ]
    },
    {
      texto: "¿Estás expuesto a contaminación del aire o polvo en tu trabajo?",
      clave: "ocupacional",
      opciones: [
        { texto: "Sí", puntos: 2 },
        { texto: "No", puntos: 0 }
      ]
    },
    {
      texto: "¿Tu casa tiene buena ventilación?",
      clave: "ventilacion",
      opciones: [
        { texto: "Sí", puntos: 0 },
        { texto: "No", puntos: 2 }
      ]
    },
    {
      texto: "¿Tienes tos persistente (más de 3 semanas) o te falta el aire con facilidad?",
      clave: "alarma",
      opciones: [
        { texto: "Sí", puntos: 4, alerta: true },
        { texto: "No", puntos: 0 }
      ]
    }
  ];

  var indicePregunta = 0;
  var respuestas = {};

  document.addEventListener("DOMContentLoaded", function () {
    iniciarCuestionario();
    iniciarRespiracion();
  });

  function iniciarCuestionario() {
    var areaPregunta = document.getElementById("area-pregunta");
    if (!areaPregunta) return;

    var botonReiniciar = document.getElementById("boton-reiniciar-cuestionario");
    botonReiniciar.addEventListener("click", function () {
      indicePregunta = 0;
      respuestas = {};
      document.getElementById("area-resultado-cuestionario").hidden = true;
      areaPregunta.hidden = false;
      mostrarPregunta();
    });

    mostrarPregunta();
  }

  function mostrarPregunta() {
    var areaPregunta = document.getElementById("area-pregunta");
    var barraProgreso = document.getElementById("barra-progreso");
    var textoProgreso = document.getElementById("texto-progreso");
    var pregunta = PREGUNTAS[indicePregunta];

    barraProgreso.style.width = Math.round((indicePregunta / PREGUNTAS.length) * 100) + "%";
    textoProgreso.textContent = "Pregunta " + (indicePregunta + 1) + " de " + PREGUNTAS.length;

    var html = '<h3>' + pregunta.texto + '</h3><div style="display:flex; flex-direction:column; gap:0.6rem;">';
    pregunta.opciones.forEach(function (opcion, indice) {
      html +=
        '<button class="boton boton-secundario" type="button" data-indice-opcion="' +
        indice +
        '" style="width:100%; justify-content:flex-start;">' +
        opcion.texto +
        "</button>";
    });
    html += "</div>";
    areaPregunta.innerHTML = html;

    areaPregunta.querySelectorAll("button").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var opcionElegida = pregunta.opciones[parseInt(boton.getAttribute("data-indice-opcion"), 10)];
        respuestas[pregunta.clave] = opcionElegida;
        indicePregunta += 1;

        if (indicePregunta < PREGUNTAS.length) {
          mostrarPregunta();
        } else {
          mostrarResultado();
        }
      });
    });
  }

  function mostrarResultado() {
    var areaPregunta = document.getElementById("area-pregunta");
    var areaResultado = document.getElementById("area-resultado-cuestionario");
    var barraProgreso = document.getElementById("barra-progreso");
    var textoProgreso = document.getElementById("texto-progreso");

    barraProgreso.style.width = "100%";
    textoProgreso.textContent = "Pregunta " + PREGUNTAS.length + " de " + PREGUNTAS.length;
    areaPregunta.hidden = true;

    var puntajeTotal = 0;
    var hayAlerta = false;
    Object.keys(respuestas).forEach(function (clave) {
      puntajeTotal += respuestas[clave].puntos;
      if (respuestas[clave].alerta) hayAlerta = true;
    });

    var titulo = document.getElementById("titulo-resultado");
    var texto = document.getElementById("texto-resultado");
    var listaRecomendaciones = document.getElementById("lista-recomendaciones-cuestionario");
    listaRecomendaciones.innerHTML = "";

    var nivel;
    if (hayAlerta || puntajeTotal >= 10) {
      nivel = "conviene consultar";
      titulo.textContent = "Conviene consultar a un médico";
      texto.textContent =
        "Algunas de tus respuestas sugieren hábitos o síntomas que conviene revisar con un profesional de la salud. Este cuestionario es educativo y no es un diagnóstico.";
    } else if (puntajeTotal >= 4) {
      nivel = "mejorables";
      titulo.textContent = "Tus hábitos respiratorios son mejorables";
      texto.textContent =
        "Tienes algunos hábitos favorables, pero hay puntos donde podrías reducir tu riesgo respiratorio.";
    } else {
      nivel = "favorables";
      titulo.textContent = "Tus hábitos respiratorios son favorables";
      texto.textContent = "¡Bien hecho! Sigue manteniendo estos hábitos que protegen tus pulmones.";
    }

    var recomendaciones = [];

    if (respuestas.fuma && respuestas.fuma.puntos > 0) {
      recomendaciones.push("Buscar apoyo para dejar de fumar es el cambio con mayor impacto en tu salud pulmonar.");
    }
    if (respuestas.humoSegunda && respuestas.humoSegunda.puntos > 0) {
      recomendaciones.push("Procura alejarte de espacios cerrados donde otras personas fuman.");
    }
    if (respuestas.lena && respuestas.lena.puntos > 0) {
      recomendaciones.push("Si usas leña para cocinar, procura ventilar bien el espacio o usar una estufa con chimenea.");
    }
    if (respuestas.ejercicio && respuestas.ejercicio.puntos > 0) {
      recomendaciones.push("Incorporar actividad física regular ayuda a mantener tus pulmones sanos.");
    }
    if (respuestas.vacunas && respuestas.vacunas.puntos > 0) {
      recomendaciones.push("Consulta con tu médico sobre las vacunas de influenza y neumococo.");
    }
    if (respuestas.ocupacional && respuestas.ocupacional.puntos > 0) {
      recomendaciones.push("Si trabajas expuesto a polvo o humos, utiliza el equipo de protección adecuado.");
    }
    if (respuestas.ventilacion && respuestas.ventilacion.puntos > 0) {
      recomendaciones.push("Mejorar la ventilación de tu hogar reduce la acumulación de contaminantes en el aire.");
    }
    if (hayAlerta) {
      recomendaciones.push("La tos persistente o la falta de aire son señales de alarma: acude con un médico.");
    }
    if (recomendaciones.length === 0) {
      recomendaciones.push("Sigue cuidando tus pulmones evitando el humo de tabaco y de leña, y manteniéndote activo.");
    }

    recomendaciones.forEach(function (texto) {
      var li = document.createElement("li");
      li.innerHTML =
        '<svg class="icono-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' +
        texto +
        "</span>";
      listaRecomendaciones.appendChild(li);
    });

    areaResultado.hidden = false;
  }

  // --- Ejercicio de respiracion guiada: inhalar 4s, exhalar 6s ---
  function iniciarRespiracion() {
    var boton = document.getElementById("boton-respiracion");
    var circulo = document.getElementById("circulo-respiracion");
    var texto = document.getElementById("texto-respiracion");
    if (!boton) return;

    var activo = false;
    var cicloActual = null;

    var prefiereReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ciclo() {
      if (!activo) return;
      circulo.style.transitionDuration = "4s";
      circulo.style.transform = prefiereReducido ? "none" : "scale(1.25)";
      texto.textContent = "Inhala";

      cicloActual = window.setTimeout(function () {
        if (!activo) return;
        circulo.style.transitionDuration = "6s";
        circulo.style.transform = "scale(1)";
        texto.textContent = "Exhala";

        cicloActual = window.setTimeout(ciclo, 6000);
      }, 4000);
    }

    boton.addEventListener("click", function () {
      activo = !activo;

      if (activo) {
        boton.textContent = "Pausar";
        ciclo();
      } else {
        boton.textContent = "Iniciar";
        window.clearTimeout(cicloActual);
        texto.textContent = "Listo";
        circulo.style.transform = "scale(1)";
      }
    });
  }
})();
