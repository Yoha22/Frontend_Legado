-- ═══════════════════════════════════════════════════════════════════════════
--  Datos iniciales
-- ═══════════════════════════════════════════════════════════════════════════
--
--  Provienen del prototipo de Claude Design, adaptados a Moñitos (Córdoba).
--  Los programas, horarios, sedes, cupos y precios son PROPUESTAS: hay que
--  confirmarlos con la escuela antes de publicar.
--
--  Idempotente: se puede ejecutar varias veces sin duplicar filas.

-- ── Programas ───────────────────────────────────────────────────────────────

insert into public.programas
  (slug, nombre, edad_min, edad_max, edad_label, enfoque, dias, horario, sede, cupos_label, foto_alt, orden, destacado)
values
  ('iniciacion', 'Iniciación', 5, 7, '5–7',
   'Motricidad, juego y primeros fundamentos. Sin competencia formal.',
   'Sáb', '8:00 – 10:00 a.m.', 'Sede norte', '6 disponibles',
   'Foto: niños pequeños con tee', 1, true),

  ('infantil', 'Infantil', 8, 10, '8–10',
   'Fundamentos técnicos, reglas del juego y trabajo en equipo.',
   'Mar · Jue · Sáb', '4:00 – 6:00 p.m.', 'Sede norte', '9 disponibles',
   'Foto: práctica de bateo', 2, true),

  ('pre-juvenil', 'Pre-juvenil', 11, 13, '11–13',
   'Técnica avanzada, lectura de juego y fundamentos tácticos.',
   'Lun · Mié · Vie', '4:00 – 6:30 p.m.', 'Sede sur', '4 disponibles',
   'Foto: fildeo en el cuadro', 3, true),

  ('juvenil', 'Juvenil / Alto rendimiento', 14, 17, '14–17',
   'Preparación competitiva, física y exposición a showcases.',
   'Lun a Vie', '5:00 – 8:00 p.m.', 'Sede sur', 'Cupos cerrados',
   'Foto: lanzador en el montículo', 4, true),

  ('vacacionales', 'Vacacionales', 5, 15, '5–15',
   'Intensivos de dos semanas en junio y diciembre.',
   'Lun a Sáb', '8:00 a.m. – 12:00 m.', 'Sede norte', 'Abre en mayo',
   'Foto: grupo del vacacional', 5, false),

  ('clinicas', 'Clínicas especializadas', null, null, 'Todas',
   'Pitcheo, cátcher y bateo con entrenadores invitados.',
   'Un sábado al mes', '9:00 a.m. – 1:00 p.m.', 'Sede sur', 'Por convocatoria',
   'Foto: clínica de pitcheo', 6, false)
on conflict (slug) do nothing;

-- ── Testimonios ─────────────────────────────────────────────────────────────

insert into public.testimonios (cita, autor, orden)
select * from (values
  ('Mi hijo llegó tímido y hoy es capitán de su categoría. Aquí no solo le enseñan béisbol, le enseñan a comportarse.',
   'Marta P., mamá de Samuel · Infantil', 1::smallint),
  ('Los entrenadores conocen a cada niño por su nombre y saben qué necesita mejorar. Eso no se paga.',
   'Jorge R., papá de Andrés · Pre-juvenil', 2::smallint),
  ('Entré a los nueve años sin saber agarrar un guante. Ahora juego en la selección Córdoba.',
   'Camilo D., exalumno · Juvenil', 3::smallint)
) as v(cita, autor, orden)
where not exists (select 1 from public.testimonios);

-- ── Eventos (junio de 2026, como el calendario del prototipo) ───────────────

insert into public.eventos (titulo, detalle, fecha, tipo)
select * from (values
  ('Entrenamiento',        null::text,                                                      date '2026-06-04', 'entrenamiento'::tipo_evento),
  ('Torneo local sub-12',  'Sede norte · fase de grupos, todo el día.',                      date '2026-06-06', 'torneo'),
  ('Reunión de padres',    'Informe del semestre y calendario de vacacionales.',             date '2026-06-11', 'reunion'),
  ('Torneo local',         null,                                                             date '2026-06-13', 'torneo'),
  ('Clínica de pitcheo',   'Con entrenador invitado. Cupos por convocatoria.',               date '2026-06-18', 'clinica'),
  ('Amistoso',             null,                                                             date '2026-06-20', 'amistoso'),
  ('Evaluaciones',         'Evaluación técnica trimestral por categoría.',                   date '2026-06-25', 'evaluacion'),
  ('Inicio vacacional',    'Arranca el intensivo de dos semanas.',                           date '2026-06-27', 'vacacional')
) as v(titulo, detalle, fecha, tipo)
where not exists (select 1 from public.eventos);

-- ── Noticias ────────────────────────────────────────────────────────────────

insert into public.noticias (slug, titulo, resumen, fecha, foto_alt)
values
  ('sub-12-campeon-cordoba',
   'Sub-12 campeón del torneo de Córdoba',
   'El equipo cerró invicto la fase final. Resumen del partido y palabras del cuerpo técnico.',
   date '2026-05-24', 'Foto: equipo con trofeo'),

  ('dos-juveniles-a-la-seleccion',
   'Dos juveniles convocados a la selección departamental',
   'Los resultados de las evaluaciones de abril abrieron la puerta a la convocatoria.',
   date '2026-05-12', 'Foto: jugador firmando'),

  ('becas-segundo-semestre',
   'Abren las becas del segundo semestre',
   'Diez cupos para familias del sector. Requisitos y fechas de postulación.',
   date '2026-05-03', 'Foto: entrega de becas')
on conflict (slug) do nothing;

-- ── Patrocinadores ──────────────────────────────────────────────────────────
--
-- Marcadores hasta que lleguen los logos y nombres reales de los aliados.

insert into public.patrocinadores (nombre, nivel, orden)
select * from (values
  ('Logo aliado 1', 'oro'::nivel_patrocinio,    1::smallint),
  ('Logo aliado 2', 'plata',                    2::smallint),
  ('Logo aliado 3', 'plata',                    3::smallint),
  ('Logo aliado 4', 'bronce',                   4::smallint),
  ('Logo aliado 5', 'bronce',                   5::smallint)
) as v(nombre, nivel, orden)
where not exists (select 1 from public.patrocinadores);
