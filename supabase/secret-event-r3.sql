-- STRATEGOS IA: migración para evento secreto de ronda 3.
-- Aplicar EXCLUSIVAMENTE al proyecto Supabase de STRATEGOS IA.
create or replace function public.cbc_submit_secret_answer(
 p_code text,p_event text,p_option text,p_reason text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare g public.cbc_game%rowtype; n int; t jsonb;
begin
 select * into g from public.cbc_game where id=1 for update;
 if (g.state->>'round')::int<>3 or g.state->>'phase'<>'decisions'
   then raise exception 'El evento secreto ya no admite respuestas'; end if;
 if coalesce((g.state->'secretEvent'->>'active')::boolean,false)<>true
   or g.state->'secretEvent'->>'id'<>p_event
   or p_event not in ('supply','competitor','regulation','technology','recession')
   then raise exception 'El evento no está activado'; end if;
 if p_option not in ('A','B','C','D') then raise exception 'Opción no válida'; end if;
 if length(trim(coalesce(p_reason,'')))<20 or length(p_reason)>1500
   then raise exception 'La justificación debe tener entre 20 y 1500 caracteres'; end if;
 select (x.ordinality-1)::integer,x.team into n,t
 from jsonb_array_elements(g.state->'teams') with ordinality as x(team,ordinality)
 where upper(x.team->>'code')=upper(trim(coalesce(p_code,'')))
 limit 1;
 if n is null or coalesce((t->>'active')::boolean,true)=false
   then raise exception 'Equipo no válido o inactivo'; end if;
 if coalesce((t->>'submitted')::boolean,false)<>true
   then raise exception 'Primero debe entregar las decisiones ordinarias'; end if;
 if t->'secretAnswer' is not null and t->'secretAnswer'<>'null'::jsonb
   then raise exception 'Este equipo ya respondió al evento secreto'; end if;
 g.state:=jsonb_set(g.state,array['teams',n::text],
   t||jsonb_build_object('secretAnswer',jsonb_build_object(
     'option',p_option,'reason',trim(p_reason))));
 update public.cbc_game set state=g.state,version=version+1,updated_at=now() where id=1;
 return jsonb_build_object('ok',true,'round',3);
end $$;
revoke all on function public.cbc_submit_secret_answer(text,text,text,text) from public,anon,authenticated;
grant execute on function public.cbc_submit_secret_answer(text,text,text,text) to anon,authenticated;

-- No mostrar las decisiones secretas de los equipos rivales.
create or replace function public.cbc_student_state(p_code text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare g public.cbc_game%rowtype; my_id int; filtered jsonb; my_code text;
begin
 my_code:=upper(trim(coalesce(p_code,'')));
 select * into g from public.cbc_game where id=1;
 select (x->>'id')::int into my_id
 from jsonb_array_elements(g.state->'teams') x
 where x->>'code'=my_code and coalesce((x->>'active')::boolean,true) limit 1;
 if my_id is null then raise exception 'Código de equipo no válido o inactivo'; end if;
 select jsonb_agg(
   case when (x->>'id')::int=my_id then x
     else (x-'code'-'decision'-'idea'-'last'-'history'-'canvasGrade'-'secretAnswer') ||
       jsonb_build_object('code','','decision',null,'history','[]'::jsonb,
         'last',null,'secretAnswer',null,
         'canvasGrade',case when x->'canvasGrade'->'scores' is not null
             then jsonb_build_object('scores',x->'canvasGrade'->'scores')
             else null end)
   end order by (x->>'id')::int
 ) into filtered from jsonb_array_elements(g.state->'teams') x;
 return jsonb_build_object('version',g.version,'state',jsonb_set(g.state,'{teams}',filtered));
end $$;
revoke all on function public.cbc_student_state(text) from public,anon,authenticated;
grant execute on function public.cbc_student_state(text) to anon,authenticated;
