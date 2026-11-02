# STRATEGOS IA

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
