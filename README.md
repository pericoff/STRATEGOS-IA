# STRATEGOS IA

## Decisiones estratégicas vinculantes (actualización)

Tomando como referencia la presentación docente aportada, se han introducido **dos decisiones de opción múltiple dentro de las cuatro rondas**, manteniendo las siete variables económicas en cada ronda:

- **Ronda 1: estrategia competitiva.** Elegir una sola opción entre **liderazgo en costes**, **diferenciación** y **segmentación/enfoque**. Se mantiene como compromiso en rondas posteriores.
- **Ronda 3: iniciativa prioritaria.** Elegir entre **automatización/eficiencia**, **innovación/calidad/circularidad** y **especialización comercial**. Su alineamiento con la elección inicial repercute en rondas 3 y 4.

El motor conserva la puntuación original (0–100) y aplica un ajuste separado: **+3/−3 puntos por coherencia entre inversiones, precio y estrategia** en cada ronda y, desde la ronda 3, **+2/−2 por la iniciativa alineada con la estrategia**, siempre limitado a 0–100. Las estrategias no conceden ventajas automáticas de demanda o beneficio. El ajuste se almacena con el resultado y se presenta tanto al alumno como al profesor.

**Condiciones didácticas exactas:** costes: `capacityInv >= 10000` y `price <= 50`; diferenciación: `rdInv + ecoInv >= 20000` y `price >= 40`; enfoque: `marketingInv >= 12000` y `price >= 42`. Las iniciativas alineadas respectivamente son eficiencia, innovación y especialización.

**Partidas existentes:** los resultados históricos no se recalculan. En una partida iniciada antes de la mejora se puede definir la estrategia en la ronda 3, junto con la iniciativa. Si no existe selección histórica (o hubo cierre forzoso), la puntuación conserva el cálculo anterior hasta que se haga una elección explícita.

**Datos y despliegue:** se guardan los identificadores de opción en el JSON `p_decision` de la RPC `cbc_submit_decision`. El SQL actual acepta estos campos adicionales, por lo que no requiere migración. La validación de opciones cerradas ocurre en el cliente; no se deben presentar los selectores como una restricción impuesta por la base de datos. El cálculo de puntos se realiza en el motor del panel docente en el cierre de cada ronda, y el docente puede revisar el ajuste aplicado. Archivo nuevo: `strategic-choices.js`.



**Simulación empresarial independiente**, clonada del motor de Circular Business Challenge 2.

## Estado

Los portales, manual, CSS, los cinco vídeos originales y el motor de cuatro rondas están copiados. **La aplicación todavía no está conectada**: por seguridad `sync.js` tiene vacíos tanto la URL como la clave de Supabase. No utiliza ni puede modificar la partida original.

## Activación de la aplicación

1. Crea un proyecto **nuevo** en [Supabase](https://supabase.com/dashboard/projects). No ejecutes estos scripts sobre el proyecto de Circular Business Challenge 2.
2. En el SQL Editor del proyecto nuevo ejecuta [supabase/setup.sql](supabase/setup.sql). Creará tablas, funciones, políticas, cuatro equipos con códigos nuevos y una partida inicial independiente.
3. En **Authentication → Users** crea/invita al usuario profesor con correo `pnunez@ujaen.es`. Si utilizas otro correo, cambia el correo autorizado en `supabase/setup.sql` antes de ejecutarlo, o actualiza la tabla `cbc_teachers` del nuevo proyecto.
4. En **Project Settings → API** del nuevo proyecto copia únicamente **Project URL** y la clave pública **publishable/anon**. Edita las dos constantes `base` y `key` en `sync.js` de este repositorio. No publiques secretos `service_role` ni contraseñas.
5. En GitHub abre **Settings → Pages**, configura *Deploy from a branch*, **main** y **/(root)**. Los archivos HTML quedarán publicados cuando Pages termine el despliegue.

## Enlaces previstos cuando Pages esté activado

- Alumnos: https://pericoff.github.io/STRATEGOS-IA/
- Profesor: https://pericoff.github.io/STRATEGOS-IA/profesor.html
- Manual: https://pericoff.github.io/STRATEGOS-IA/guia-alumnado.html

## Funcionamiento

- Cuatro rondas y dos a cuatro empresas.
- Siete decisiones empresariales, eventos, resultados y clasificación.
- Business Model Canvas y rúbrica docente de siete criterios.
- Nota final: **80 % de la media de las cuatro rondas + 20 % del Canvas**.
- Cinco enlaces de vídeos copiados inicialmente del juego original: introducción general y rondas 1 a 4. Pueden sustituirse después.

## Independencia y seguridad

El código fuente y el almacenamiento local usan nombres propios de STRATEGOS IA. Las funciones SQL conservan temporalmente el prefijo interno `cbc_`, pero se ejecutan **solo en el proyecto Supabase nuevo**. No introduzcas en `sync.js` la dirección ni la clave del proyecto original. El profesor y los equipos deben usar únicamente los códigos y credenciales de la nueva instancia.

**El nombre STRATEGOS IA no implica funciones de inteligencia artificial en esta primera versión; es una copia funcional y no incluye agentes IA ni integraciones de modelos.**


## Informes estratégicos automáticos por ronda

- Tras publicar una ronda, cada alumno verá su **informe de cierre** desde **4 · Resultados**, únicamente con los indicadores de su empresa.
- Para cada ronda publicada se incluyen **rentabilidad, liquidez, competitividad y sostenibilidad**, conclusiones basadas en datos, riesgos, recomendaciones y preguntas para el debate.
- El alumno puede cambiar la ronda e **imprimir / guardar como PDF** desde el navegador.
- En el panel autenticado del profesor, bajo los resultados, aparece **Informes estratégicos de cierre** con un selector de equipos.
- La elaboración del informe base se hace **localmente y sin coste de API**; la ampliación opcional mediante el botón **Ampliar interpretación con IA** llama a la función segura `strategos-advisor` y consume crédito de OpenAI.
- El informe no cambia la calificación ni muestra decisiones no publicadas. Las recomendaciones usan umbrales didácticos, no predicen resultados futuros.
- Archivos: `reports.js` y los portales `index.html` y `profesor.html`.
