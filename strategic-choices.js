/* STRATEGOS IA · decisiones estratégicas vinculantes (2 de 4 rondas).
   Inspiradas en la presentación docente: elección de estrategia,
   inversión consistente y repercusión en resultados posteriores.
   No modifica datos históricos ni el SQL. */
const StrategicChoices=(()=>{
 const strategies={
  cost:{label:'A · Liderazgo en costes',description:'Priorizar eficiencia, escala y precios competitivos. Conviene sostenerlo con inversión productiva y disciplina de costes.'},
  differentiation:{label:'B · Diferenciación',description:'Competir mediante calidad, innovación y sostenibilidad. Conviene respaldarlo con I+D e inversión ambiental.'},
  focus:{label:'C · Segmentación o enfoque',description:'Servir a un nicho con una propuesta específica. Conviene conocer al cliente y reforzar marketing y servicio.'}
 };
 const actions={
  efficiency:{label:'A · Automatización y eficiencia',description:'Mejorar capacidad, procesos y eficiencia productiva.'},
  innovation:{label:'B · Innovación, calidad y circularidad',description:'Desarrollar nuevos materiales y reforzar calidad y sostenibilidad.'},
  segment:{label:'C · Especialización comercial',description:'Concentrar esfuerzos en un segmento y fortalecer relación y canales comerciales.'}
 };
 const fit={cost:'efficiency',differentiation:'innovation',focus:'segment'};
 const roundChoice=(team,round,key)=>{
  const h=Array.isArray(team?.history)?team.history.find(x=>Number(x.round)===round):null;
  return h?.[key]||((team?.submitted||team?.decision)&&Number(team?.currentRound||0)===round?team.decision?.[key]:null)||null;
 };
 const strategy=(team,currentRound,decision)=>{
  if(currentRound===1&&decision?.strategyChoice)return decision.strategyChoice;
  const history=Array.isArray(team?.history)?team.history:[];
  return history.find(x=>Number(x.round)===1)?.strategyChoice||history.find(x=>Number(x.round)===3)?.strategyChoice||decision?.strategyChoice||null;
 };
 const action=(team,currentRound,decision)=>{
  if(currentRound===3&&decision?.actionChoice)return decision.actionChoice;
  const history=Array.isArray(team?.history)?team.history:[];
  return history.find(x=>Number(x.round)===3)?.actionChoice||null;
 };
 function evaluate(team,round,decision){
  const s=strategy(team,round,decision),a=action(team,round,decision);
  // Partidas anteriores sin elecciones explícitas: no penalización retroactiva.
  if(!s||!strategies[s])return {strategy:null,action:null,adjustment:0,description:'Partida anterior sin estrategia seleccionada: puntuación habitual.'};
  const d=decision||{},capacity=Number(d.capacityInv)||0,rd=Number(d.rdInv)||0,eco=Number(d.ecoInv)||0,marketing=Number(d.marketingInv)||0,price=Number(d.price)||0;
  let aligned=false;
  if(s==='cost')aligned=capacity>=10000&&price<=50;
  if(s==='differentiation')aligned=rd+eco>=20000&&price>=40;
  if(s==='focus')aligned=marketing>=12000&&price>=42;
  // Se valora coherencia, no se regalan ventas o beneficios por elegir una etiqueta.
  let adjustment=aligned?3:-3;
  if(round>=3&&a&&actions[a])adjustment+=fit[s]===a?2:-2;
  return {strategy:s,action:a&&actions[a]?a:null,adjustment,aligned,description:
    (aligned?'La inversión y la política de precios respaldan la estrategia.':'Las decisiones económicas no respaldan suficientemente la estrategia.')+
    (round>=3&&a&&actions[a]?(fit[s]===a?' La decisión de la ronda 3 refuerza la estrategia.':' La decisión de la ronda 3 entra en conflicto con la estrategia.'): '')};
 }
 function validate(round,d){
  if(round===1&&!strategies[d?.strategyChoice])return 'Selecciona una estrategia competitiva para tu empresa.';
  if(round===3&&!actions[d?.actionChoice])return 'Selecciona una alternativa estratégica para la tercera ronda.';
  return '';
 }
 function picker(round,d,team){
  const kind=round===1?'strategyChoice':round===3?'actionChoice':null;
  if(!kind)return '';
  const catchup=round===3&&!strategy(team,round,d);
  const catchupPanel=catchup?'<section class="card"><h3>Definir estrategia inicial para la partida en curso</h3><p>Esta partida comenzó antes de incluir la elección de estrategia. Elegid una ahora para que las puntuaciones de esta y la próxima ronda puedan evaluar su coherencia. Los resultados anteriores no se recalcularán.</p>'+Object.entries(strategies).map(([key,v])=>'<label style="display:block;margin:8px 0"><input type="radio" name="strategyChoice" value="'+key+'" style="width:auto" required> <b>'+v.label+'</b> · '+v.description+'</label>').join('')+'</section>':'';
  const options=round===1?strategies:actions;
  const heading=round===1?'Decisión estratégica 1/2 · ¿Cómo queréis competir?':'Decisión estratégica 2/2 · ¿Qué acción priorizaréis?';
  const intro=round===1?'Elegid una de las tres estrategias. Será el compromiso de vuestra empresa en las cuatro rondas, y las puntuaciones posteriores premiarán o penalizarán la coherencia con las inversiones.':'Elegid una iniciativa para reforzar vuestra estrategia. La coherencia con la elección inicial y las inversiones condicionará las puntuaciones de las rondas 3 y 4.';
  return catchupPanel+'<section class="card" style="border:2px solid #8ca9d0"><h3>'+heading+'</h3><p>'+intro+'</p>'+
   Object.entries(options).map(([key,v])=>'<label style="display:block;padding:12px;margin:8px 0;border:1px solid #d0d8e7;border-radius:10px;cursor:pointer"><input type="radio" name="'+kind+'" value="'+key+'" style="width:auto;margin-right:8px" '+(d?.[kind]===key?'checked':'')+' required><b>'+v.label+'</b><span style="display:block;margin:5px 0 0 24px">'+v.description+'</span></label>').join('')+
   '<p class="muted">No existe una opción ganadora automáticamente. Los recursos, la política comercial y el contexto determinarán el resultado.</p></section>';
 }
 function summary(team,round,decision){
  const s=strategy(team,round,decision),a=action(team,round,decision);
  return (s&&strategies[s]?'Estrategia: '+strategies[s].label:'Estrategia no registrada')+
   (a&&actions[a]?' · Iniciativa: '+actions[a].label:'');
 }
 return {strategies,actions,fit,strategy,action,evaluate,validate,picker,summary};
})();