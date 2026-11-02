# Activación del asesor IA de STRATEGOS IA

## Qué está implementado

La pestaña **🧠 5 · Asesor IA** aparece tras entrar con el código del equipo. Ofrece:

1. **Análisis automático sin coste de API:** ventas, resultado operativo, tesorería, capacidad, evolución y riesgos, exclusivamente a partir de las rondas publicadas de ese equipo. Disponible inmediatamente tras el despliegue de GitHub Pages.
2. **Preguntas abiertas al asesor generativo:** necesita desplegar la función Edge `strategos-advisor` y una clave del proveedor de IA. Antes de activarla se mostrará claramente que no está disponible. Las consultas no alteran las decisiones, notas ni resultados.

## Pasos pendientes para respuestas generativas

1. En el proyecto nuevo de STRATEGOS IA (`syewhwkgccavsalzbekm`), abre **Supabase Dashboard → Edge Functions → Deploy a new function → Via Editor**.
2. Nombre exacto: **strategos-advisor**. Pega el contenido íntegro de [functions/strategos-advisor/index.ts](functions/strategos-advisor/index.ts), sustituyendo el contenido de ejemplo. Haz clic en **Deploy**.
3. En la configuración de la función, **desactiva la verificación de JWT (Verify JWT)**. La aplicación utiliza la clave pública publishable en el navegador, y la función comprueba el código privado del equipo mediante `cbc_student_state` antes de llamar al modelo. No desactives permisos RLS de las tablas ni compartas códigos.
4. En **Supabase → Edge Functions → Secrets**, crea el secreto `OPENAI_API_KEY` con una clave válida de la API de OpenAI, obtenida en tu propia cuenta de API. **Nunca la pegues en GitHub ni en un archivo HTML o JS público.** La suscripción ChatGPT no incluye automáticamente crédito API.
5. Comprueba que la función recibe automáticamente `SUPABASE_URL` y `SUPABASE_ANON_KEY` (entorno estándar de Supabase Edge Functions). Si tu proyecto no ofrece `SUPABASE_ANON_KEY`, deberás configurar la clave pública equivalente como secreto de función y modificar el lector de esa variable en el código.
6. Recarga el portal del alumno, entra con el código propio del equipo, pulsa **🧠 5 · Asesor IA**, escribe una pregunta y pulsa **Consultar al asesor IA**.

## Seguridad y privacidad

- La función no confía en los resultados ni las cifras que le envíe el navegador; consulta `cbc_student_state` desde Supabase.
- Esta RPC valida el código del equipo y filtra las decisiones, Canvas, historial y notas privadas de los demás equipos.
- La función envía al modelo exclusivamente métricas del equipo autenticado y la pregunta enviada. No envía códigos, emails, nombres personales ni datos de otros equipos.
- Solo admite peticiones originadas desde los dominios autorizados de GitHub Pages y ProfePedro; el control de origen no sustituye la comprobación del código.
- Máximo orientativo: cinco consultas por equipo cada cinco minutos **por instancia** de Edge Function. Para clases grandes, implementar límite persistente de uso y presupuesto del proveedor.
- Las respuestas son apoyo pedagógico; no modifican decisiones, calificaciones ni hechos registrados. No garantizan precisión ni representan consejo empresarial profesional.
- La API OpenAI tiene consumo y facturación independientes de ChatGPT.
- Si cambias los nombres de equipo o reinicias la simulación, los nuevos códigos siguen validándose con la RPC existente.
- Si se modifica la política de acceso, revisa y prueba de nuevo la función.

## Recursos

- Portal: https://pericoff.github.io/STRATEGOS-IA/
- Función: [supabase/functions/strategos-advisor/index.ts](functions/strategos-advisor/index.ts)
- Código cliente: [advisor.js](../../advisor.js)
