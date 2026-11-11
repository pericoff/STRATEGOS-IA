/* Evento secreto de la ronda 3. Ningún escenario se expone al alumno hasta la activación docente. */
const SecretEvents=(()=>{
 const events={
  supply:{name:'Ruptura de suministro',story:'El proveedor principal interrumpe entregas. El comité de dirección debe responder sin comprometer su estrategia.',options:{A:'Contratar un proveedor alternativo fiable, aunque más caro',B:'Reducir producción temporalmente y proteger la tesorería',C:'Invertir en autonomía y diversificación de suministros',D:'Repercutir el sobrecoste en los precios'}},
  competitor:{name:'Nuevo competidor internacional',story:'Un nuevo fabricante entra en el mercado con precios agresivos y una campaña comercial intensa.',options:{A:'Competir reduciendo precios y costes',B:'Reforzar calidad y diferenciación',C:'Concentrarse en clientes especializados',D:'Incrementar promoción y distribución'}},
  regulation:{name:'Nueva exigencia ambiental',story:'La administración anuncia nuevos requisitos ambientales para los materiales de construcción.',options:{A:'Invertir en materiales recuperados y trazabilidad',B:'Adaptar solo los procesos imprescindibles',C:'Reforzar innovación y certificación',D:'Trasladar los costes regulatorios al precio'}},
  technology:{name:'Tecnología disruptiva',story:'Una solución de fabricación automatizada amenaza con dejar obsoletas las instalaciones actuales.',options:{A:'Automatizar inmediatamente parte de la planta',B:'Colaborar con un centro de investigación',C:'Especializar la producción actual',D:'Posponer la inversión y preservar caja'}},
  recession:{name:'Contracción económica inesperada',story:'La inversión en construcción cae y los clientes aplazan sus pedidos.',options:{A:'Reducir precios para mantener volumen',B:'Preservar caja y ajustar producción',C:'Buscar nichos de alto valor añadido',D:'Invertir en innovación y mercados futuros'}}
 };
 const preferences={supply:{cost:'B',differentiation:'C',focus:'A'},competitor:{cost:'A',differentiation:'B',focus:'C'},regulation:{cost:'B',differentiation:'C',focus:'A'},technology:{cost:'A',differentiation:'B',focus:'C'},recession:{cost:'B',differentiation:'D',focus:'C'}};
 const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function evaluate(eventId,answer,strategy){
  if(!events[eventId])return {delta:0,carry:0,reason:'No hay evento secreto activo.'};
  if(!answer||answer.option==='skip')return {delta:-4,carry:-2,reason:'No se respondió a la crisis.'};
  if(!events[eventId].options[answer.option])return {delta:-4,carry:-2,reason:'Respuesta no válida.'};
  const preferred=preferences[eventId]?.[strategy];
  const aligned=Boolean(preferred)&&preferred===answer.option;
  const delta=aligned?4:preferred?-1:1;
  return {delta,carry:aligned?2:preferred?-1:0,reason:aligned?'Respuesta especialmente coherente con la estrategia inicial.':preferred?'Respuesta viable, pero menos alineada con la estrategia inicial.':'Respuesta registrada; estrategia inicial no disponible.'};
 }
 function teacherPanel(db){
  if(db.round!==3)return '';
  const se=db.secretEvent||{};
  const ready=db.phase==='decisions'&&db.teams.filter(t=>t.active!==false).every(t=>t.submitted);
  const options=Object.entries(events).map(([id,event])=>'<option value="'+id+'">'+safe(event.name)+'</option>').join('');
  const responses=db.teams.filter(t=>t.active!==false).map(t=>'<tr><td>'+safe(t.name)+'</td><td>'+(t.secretAnswer?safe(t.secretAnswer.option==='skip'?'Sin respuesta':events[se.id]?.options[t.secretAnswer.option]||'Respondido'):'Pendiente')+'</td></tr>').join('');
  return '<section class="card"><h3>Evento secreto · Ronda 3</h3>'+
   (!se.active?'<p>Elige una crisis común para todos los equipos. Se mantendrá oculta hasta pulsar activar. Deben haber entregado primero sus decisiones ordinarias.</p><label>Escenario sorpresa</label><select id="secretEventType">'+options+'</select><button id="activateSecretEvent" '+(!ready?'disabled':'')+'>Activar evento secreto para todos</button><p class="muted">'+(ready?'Todas las decisiones ordinarias están entregadas.':'Pendiente de las decisiones ordinarias de todos los equipos.')+'</p>':
   '<div class="alert"><b>Evento activado:</b> '+safe(events[se.id]?.name||'Desconocido')+'</div><p>Los alumnos deben responder la crisis antes de publicar los resultados de la ronda 3.</p><table><thead><tr><th>Equipo</th><th>Respuesta secreta</th></tr></thead><tbody>'+responses+'</tbody></table>')+'</section>';
 }
 function studentPanel(db,t){
  const se=db.secretEvent;
  if(db.round!==3||!se?.active||!events[se.id])return '';
  const e=events[se.id];
  if(db.phase==='results')return '<section class="card"><h3>Decisión extraordinaria</h3><p>'+safe(e.name)+'</p><p><b>Respuesta:</b> '+safe(e.options[t.secretAnswer?.option]||'Sin respuesta')+'</p></section>';
  if(!t.submitted)return '<section class="card"><h3>Evento secreto activado</h3><p>Primero envía las decisiones ordinarias de esta ronda.</p></section>';
  if(t.secretAnswer)return '<section class="card"><h3>Decisión extraordinaria entregada</h3><p><b>'+safe(e.name)+'</b>: '+safe(e.options[t.secretAnswer.option]||'Sin respuesta')+'</p><p>La respuesta está registrada y no puede cambiarse.</p></section>';
  return '<section class="card"><div class="alert"><b>EVENTO EXTRAORDINARIO · '+safe(e.name)+'</b><p>'+safe(e.story)+'</p></div><p>Debéis tomar una nueva decisión, independiente de las siete decisiones económicas y de la iniciativa estratégica elegida.</p><form id="secretResponseForm">'+Object.entries(e.options).map(([k,v])=>'<label style="display:block;margin:10px 0"><input type="radio" name="option" value="'+k+'" required style="width:auto"> <b>'+k+'.</b> '+safe(v)+'</label>').join('')+'<label for="secretReason">Justificación estratégica (mínimo 20 caracteres)</label><textarea id="secretReason" name="reason" minlength="20" maxlength="1500" required placeholder="Explica por qué es coherente con vuestra estrategia y los riesgos que asumís"></textarea><button type="submit">Enviar decisión extraordinaria</button></form></section>';
 }
 return {events,evaluate,teacherPanel,studentPanel};
})();
