# Mi Salud AR

Sitio web educativo que acompaña un prototipo de realidad aumentada (Unity + Vuforia) para la materia de
Ingeniería de Software de la **Universidad La Salle Oaxaca**.

## ¿Cómo se usa?

La app de RA reconoce tres Image Targets (corazón, pulmones, cerebro) y muestra un modelo 3D del órgano junto
con un botón que abre la página correspondiente de este sitio en el navegador del celular:

- `corazon.html`
- `pulmones.html`
- `cerebro.html`

Cada página incluye datos verificados en fuentes de salud oficiales, una actividad interactiva y
recomendaciones prácticas.

## Estructura del proyecto

```
mi-salud-ar/
  index.html        Portada con las 3 tarjetas de órganos
  corazon.html       Calculadora de frecuencia cardiaca y guía para tomar el pulso
  pulmones.html       Cuestionario de hábitos respiratorios y respiración guiada
  cerebro.html        Juego de memoria y hábitos que cuidan el cerebro
  css/estilos.css     Estilos compartidos (mobile-first, variables de color por órgano)
  js/comun.js         Menú de navegación y animaciones de scroll compartidas
  js/corazon.js       Lógica de la calculadora y el contador de pulso
  js/pulmones.js      Lógica del cuestionario y del ejercicio de respiración
  js/cerebro.js       Lógica del juego de memoria
  FUENTES.md          Registro de cada dato citado, su fuente y fecha de consulta
```

## Tecnología

HTML, CSS y JavaScript puro — sin frameworks ni paso de compilación. Todas las rutas son relativas para
funcionar en GitHub Pages bajo una subcarpeta (`https://usuario.github.io/mi-salud-ar/`).

Todas las actividades interactivas corren en el navegador del usuario. No se envía ni almacena ningún dato
de salud en un servidor; la única excepción es la mejor marca del juego de memoria, que se guarda únicamente
en el `localStorage` del propio dispositivo.

## Aviso

Este es un proyecto académico con fines educativos. El contenido no sustituye la consulta médica ni
constituye un diagnóstico.
