/* Auditoría de resultados STRATEGOS IA: lectura sin modificación del estado. */
const StrategosScoreAudit=(()=>{
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=x=>x===null||x===undefined||x===''?null:(Number.isFinite(Number(x))?Number(x):null);
 const fmt=x=>num(x)===null?'Sin dato':new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(Number(x));
 const money=x=>num(x)===null?'Sin dato':new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(Number(x))+' €';
 function rounds(state){
  const result=new Map();
  for(const r of Array.isArray(state?.results)?state.results:[]){
   const n=num(r?.round);
   if(Number.isInteger(n)&&n>=1&&n<=4&&Array.isArray(r.rows))result.set(n,r);
  }
  return result;
 }
 function scoreRows(state){
  const published=rounds(state),teams=Array.isArray(state?.teams)?state.teams:[];
  return teams.filter(t=>t.active!==false||[...published.values()].some(r=>r.rows.some(row=>Number(row.id)===Number(t.id)))).map(t=>{
   const items=[1,2,3,4].map(round=>{
    const publishedRow=published.get(round)?.rows.find(row=>Number(row.id)===Number(t.id));
    const historical=Array.isArray(t.history)?t.history.find(h=>Number(h.round)===round):null;
    const record=publishedRow||historical||null;
    const score=num(record?.score),base=num(record?.baseScore),adjust=num(record?.strategyAdjustment),secret=num(record?.secretAdjustment);
    const historyScore=num(historical?.score),publishedScore=num(publishedRow?.score);
    const mismatch=publishedScore!==null&&historyScore!==null&&Math.abs(publishedScore-historyScore)>0.051;
    const formulaMismatch=score!==null&&base!==null&&adjust!==null&&Math.abs(score-Math.max(0,Math.min(100,Math.round((base+adjust+(secret??0))*10)/10)))>0.051;
    const missing=!!record&&score===null;
    const incomplete=published.has(round)&&!publishedRow;
    return {round,record,score,base,adjust,secret,mismatch,formulaMismatch,missing,incomplete,historyOnly:!publishedRow&&!!historical};
   });
   const completed=items.filter(x=>x.score!==null&&!!published.get(x.round)).length;
   const total=items.filter(x=>x.score!==null&&!!published.get(x.round)).reduce((a,x)=>a+x.score,0);
   const issues=items.filter(x=>x.mismatch||x.formulaMismatch||x.missing||x.incomplete||x.historyOnly);
   return {id:t.id,name:t.name,items,completed,average:completed?total/completed:null,final:completed===4?total/4:null,issues};
  });
 }
 function table(state){
  const teams=scoreRows(state),any=rounds(state).size;
  if(!any&&!teams.some(t=>t.items.some(i=>i.historyOnly)))return '<section class="card"><h3>Auditoría de puntuaciones</h3><p class="muted">Aún no hay resultados de rondas publicados.</p></section>';
  return '<section class="card" id="auditoria-puntuaciones"><h3>Auditoría de las cuatro rondas</h3>'+
   '<p class="muted">Lectura del historial almacenado, sin recalcular resultados. Las celdas «Pendiente» indican rondas no publicadas y «Sin dato» señala un registro incompleto. La media provisional considera solo rondas publicadas.</p>'+
   '<div style="overflow-x:auto"><table><thead><tr><th>Equipo</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>Media publicada</th><th>Media final</th><th>Integridad</th></tr></thead><tbody>'+
   teams.map(t=>'<tr><td>'+esc(t.name)+'</td>'+t.items.map(x=>'<td class="num">'+(x.score!==null?fmt(x.score):x.record?'Sin dato':'Pendiente')+
      (x.historyOnly?' *':'')+'</td>').join('')+'<td class="num">'+(t.average===null?'—':fmt(t.average))+
      '</td><td class="num">'+(t.final===null?'—':fmt(t.final))+'</td><td>'+(
      t.issues.length?'<strong>Revisar '+t.issues.map(x=>'R'+x.round).join(', ')+'</strong>':'Sin discrepancias detectadas')+'</td></tr>').join('')+
   '</tbody></table></div>'+
   (teams.some(t=>t.issues.length)?'<p><strong>Atención:</strong> se han detectado registros incompletos o diferencias entre historial y publicación. No se han corregido automáticamente para evitar alterar la partida. Un asterisco indica datos en el historial sin su correspondiente registro de publicación.</p>':'<p class="muted">No se detectan discrepancias en las puntuaciones disponibles. Esto no valida por sí solo los cálculos económicos subyacentes.</p>')+
   '</section>';
 }
 function teamHistory(team,state){
  const row=scoreRows(state).find(x=>Number(x.id)===Number(team.id));if(!row)return '';
  const published=rounds(state);
  return '<section class="card"><h3>Detalle de puntuaciones por ronda</h3><p class="muted">Datos registrados. Los ajustes sólo aparecen cuando fueron guardados por la versión vigente en aquella ronda.</p>'+
   '<div style="overflow-x:auto"><table><thead><tr><th>Ronda</th><th>Base</th><th>Coherencia</th><th>Crisis sorpresa</th><th>Total</th><th>Ventas</th><th>Resultado</th><th>Tesorería</th></tr></thead><tbody>'+
   row.items.map(x=>'<tr><td>R'+x.round+(published.has(x.round)?'':' · pendiente')+'</td>'+
   '<td class="num">'+fmt(x.base)+'</td><td class="num">'+(x.adjust===null?'No registrado':(x.adjust>0?'+':'')+fmt(x.adjust))+'</td><td class="num">'+(x.secret===null?'No registrado':(x.secret>0?'+':'')+fmt(x.secret))+'</td><td class="num">'+fmt(x.score)+'</td>'+
   '<td class="num">'+fmt(x.record?.sales)+'</td><td class="num">'+money(x.record?.operating)+'</td><td class="num">'+money(x.record?.cash)+'</td></tr>').join('')+
   '</tbody></table></div></section>';
 }
 return {rounds,scoreRows,professor:table,student:teamHistory};
})();