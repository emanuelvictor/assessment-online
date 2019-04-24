CREATE SEQUENCE agrupador_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

create table agrupador
(
  id       bigint    NOT NULL DEFAULT nextval('agrupador_id_seq'::regclass),
  created  timestamp not null,
  updated  timestamp,
  feedback varchar(300),
  primary key (id)
);

INSERT INTO agrupador(id, created)
VALUES (50, now());
select setval('agrupador_id_seq', 1000);

alter table avaliacao
  add column agrupador_id int8 not null DEFAULT 50;

alter table avaliacao
  add constraint FKjbdmix9ftxjn7kidf26gh87ld foreign key (agrupador_id) references agrupador;

create table agrupador_aud
(
  id       int8 not null,
  rev      int8 not null,
  revtype  int2,
  feedback varchar(300),
  primary key (id, rev)
);

alter table avaliacao_aud
  add column agrupador_id int8;
alter table agrupador_aud
  add constraint FKm2lp2s55p3xrng2tx7bu9bnmf foreign key (rev) references public.revision;
