# STRATEGOS IA

## Evento secreto extraordinario · ronda 3 (noviembre de 2026)

Esta función se incorpora **dentro de la ronda 3**, sin crear una quinta ronda ni reemplazar la iniciativa estratégica cerrada. Los cinco escenarios son: ruptura de suministro, nuevo competidor, nueva regulación ambiental, tecnología disruptiva y contracción económica.

- El profesor elige **un único evento por partida** y pulsa **Activar evento secreto para todos**. Hasta ese momento, el alumno no conoce el escenario. Se puede activar manualmente en cualquier momento mientras la ronda 3 esté abierta; los equipos que todavía no hayan entregado sus decisiones habituales deberán hacerlo antes de responder.
- El alumnado verá un aviso en todas las secciones, incluido el vídeo, con acceso directo a **Decisiones**. Cada equipo elige una de cuatro respuestas y escribe una justificación de 20 a 1500 caracteres.
- La función de Supabase `cbc_submit_secret_answer` valida la ronda, el evento activo, el código de equipo, la entrega ordinaria, la opción y la ausencia de respuestas duplicadas. `cbc_student_state` oculta las respuestas de equipos rivales mientras el juego está abierto.
- Ajuste al resultado de la ronda 3: **+4 puntos** por respuesta alineada con la estrategia inicial, **−1 punto** por una alternativa menos alineada, o **−4 puntos** si no se responde (en cierre docente). Para una partida sin estrategia registrada, la alternativa válida suma **+1 punto**. No se recalculan resultados pasados.
- **Efecto persistente en la ronda 4:** +2 / −1 / −2 puntos respectivamente. No se alteran las magnitudes económicas reales, solo la puntuación 0–100; el efecto aparece desglosado en la auditoría y en la exportación CSV.
- El botón de cálculo queda bloqueado en la ronda 3 hasta activar un evento y completar las respuestas; el docente puede aplicar un cierre forzoso a equipos pendientes, registrando la penalización.
- Ejecutar `supabase/secret-event-r3.sql` en el **proyecto Supabase de STRATEGOS IA** antes de publicar el código (la migración ya se aplicó al proyecto conectado). **No ejecutar `supabase/setup.sql` sobre partidas existentes.** No toca las tablas independientes `ssl_*`.
- Pruebas de regresión reproducibles: `node --test tests/secret-events.test.cjs`. Las pruebas de flujo SQL deben hacerse en una transacción con `ROLLBACK`, nunca contra los datos reales de alumnos.

**Aviso:** la activación manual debe ser una sorpresa real. Los materiales audiovisuales publicados antes de la ronda no deben revelar qué crisis seleccionará el profesor.


## Renovación audiovisual · cinco vídeos (noviembre de 2026)

La versión vigente necesita **un vídeo general y cuatro vídeos de rondas**. Los cinco guiones completos (locución en español y planos sugeridos) ya están en:

1. [Presentación general](guiones-video/00-presentacion-general.md)
2. [Ronda 1: estrategia competitiva](guiones-video/01-ronda-1.md)
3. [Ronda 2: revisión de resultados](guiones-video/02-ronda-2.md)
4. [Ronda 3: evento e iniciativa estratégica](guiones-video/03-ronda-3.md)
5. [Ronda 4: consolidación y clasificación](guiones-video/04-ronda-4.md)

**Estado:** guiones y briefings integrados, producción audiovisual aún pendiente. Las cinco URL de `videos.json` se han dejado vacías deliberadamente para no reproducir vídeos antiguos que expliquen reglas obsoletas. Al generar y publicar los cinco nuevos vídeos (YouTube/Vimeo/MP4), colocar sus URL públicas, en este orden, en `videos.json`. Se mantiene el botón para continuar a las decisiones mientras no hay vídeos. Los enlaces a los guiones vigentes aparecen en el portal.

No se han cambiado las reglas del motor ni los datos de Supabase para renovar los vídeos.


## Canvas eliminado (versión actual)

Se ha eliminado el Business Model Canvas de la interfaz del alumnado y del panel docente, incluidos el formulario, la presentación, la rúbrica y el requisito que impedía enviar decisiones antes de completarlo. El alumnado puede entrar directamente en **Decisiones** y participar desde la primera ronda.

La clasificación final ahora es la **media de las cuatro puntuaciones de ronda (100 %)**. Los ajustes por coherencia estratégica de las elecciones cerradas (rondas 1 y 3) siguen formando parte de la puntuación de cada ronda.

El cambio no ejecuta ningún borrado ni reinicia Supabase: pueden quedar campos históricos `idea` o `canvasGrade` almacenados, pero ya no participan en los cálculos ni aparecen en el portal. No se requiere SQL adicional. Los repositorios de Circular Business Challenge 2 y STRATEGOS STRATEGY LAB permanecen independientes.



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

Los portales, manual, vídeos y motor de cuatro rondas están desplegados en un repositorio independiente. La partida utiliza su propia configuración de Supabase; consulta `sync.js` para el proyecto configurado.

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

## Funcionamiento y documentación vigente

- **Cuatro rondas** con entre **dos y cuatro empresas**; siete decisiones económicas por equipo y ronda.
- Elección de estrategia competitiva en R1; elección de iniciativa prioritaria en R3. Ambas condicionan los ajustes estratégicos de puntuación.
- Evento económico visible en cada ronda y **evento extraordinario secreto en R3**, común a todos los equipos y activado manualmente por el profesor. El evento sorpresa exige una segunda entrega, con una de cuatro respuestas y justificación escrita.
- La puntuación final es **el 100 % de la media de las cuatro rondas**. Los ajustes de coherencia y del evento secreto se incorporan a la puntuación de cada ronda; **no hay Canvas ni rúbrica Canvas**.
- Cinco vídeos previstos: introducción general y rondas 1 a 4. Sus direcciones públicas se configuran en `videos.json`; los que todavía no tengan URL muestran un aviso de vídeo pendiente.
- [Reglas completas y manual actualizado del alumnado](guia-alumnado.html). Las **Reglas del juego** de los portales `index.html` y `profesor.html` recogen la misma mecánica.

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
