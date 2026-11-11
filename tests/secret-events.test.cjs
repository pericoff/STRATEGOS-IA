/* Regression tests for the classroom's secret event. Run: node --test tests/secret-events.test.cjs */
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','secret-events.js'),'utf8');
const SecretEvents=vm.runInNewContext(src+'\nSecretEvents;',Object.create(null));

function fixture(id=null,round=3,phase='decisions') {
 const teams=Array.from({length:4},(_,i)=>({id:i+1,name:'Equipo '+(i+1),active:true,submitted:true,secretAnswer:null}));
 return {round,phase,teams,secretEvent:id?{id,active:true}:null};
}

test('cinco escenarios, cuatro alternativas por crisis',()=>{
 assert.equal(Object.keys(SecretEvents.events).length,5);
 for(const event of Object.values(SecretEvents.events))assert.deepEqual(Object.keys(event.options),['A','B','C','D']);
});
test('ningún contenido secreto se muestra antes de activarlo',()=>{
 const state=fixture();
 assert.equal(SecretEvents.studentPanel(state,state.teams[0]),'');
 assert.equal(SecretEvents.studentBanner(state,state.teams[0]),'');
 assert.ok(!SecretEvents.teacherPanel(state).includes('El proveedor principal interrumpe'));
});
test('el profesor puede activar únicamente en ronda 3 abierta',()=>{
 assert.match(SecretEvents.teacherPanel(fixture()),/id="activateSecretEvent"/);
 assert.equal(SecretEvents.teacherPanel(fixture(null,2)),'');
 assert.match(SecretEvents.teacherPanel(fixture(null,3,'results')),/disabled/);
});
test('notificación y formulario visibles al activar',()=>{
 const state=fixture('supply'),team=state.teams[0];
 assert.match(SecretEvents.studentBanner(state,team),/id="goSecretEvent"/);
 assert.match(SecretEvents.studentPanel(state,team),/id="secretResponseForm"/);
 assert.match(SecretEvents.studentPanel(state,team),/Justificación estratégica/);
});
test('la respuesta registrada ya no ofrece formulario',()=>{
 const state=fixture('supply'),team=state.teams[0];
 team.secretAnswer={option:'A',reason:'Respuesta docente de prueba'};
 assert.doesNotMatch(SecretEvents.studentPanel(state,team),/id="secretResponseForm"/);
 assert.equal(SecretEvents.studentBanner(state,team),'');
});
test('evaluación coherente en 60 combinaciones y puntuaciones finitas',()=>{
 for(const [id,event] of Object.entries(SecretEvents.events)){
  for(const strategy of ['cost','differentiation','focus']){
   const evaluations=Object.keys(event.options).map(option=>SecretEvents.evaluate(id,{option},strategy));
   assert.equal(evaluations.length,4);
   assert.equal(evaluations.filter(result=>result.delta===4).length,1);
   for(const result of evaluations){assert.ok(Number.isFinite(result.delta));assert.ok(Number.isFinite(result.carry));}
  }
 }
});
test('la falta de respuesta se penaliza y no hay ajuste sin crisis',()=>{
 assert.equal(SecretEvents.evaluate('supply',null,'cost').delta,-4);
 assert.equal(SecretEvents.evaluate('supply',null,'cost').carry,-2);
 assert.equal(SecretEvents.evaluate(null,null,'cost').delta,0);
});
