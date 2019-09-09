alter table licenca drop constraint if exists UKilog5d720rixng94eqh13rps4;
alter table licenca add constraint UKilog5d720rixng94eqh13rps4 unique (tenant, nome);
create table plano (id  bigserial not null, created timestamp not null, updated timestamp, nome varchar(255) not null, quantidade_avaliacoes int4 not null, valor_avaliacoes_excedentes numeric(19, 2) not null, valor_mensal numeric(19, 2) not null, primary key (id));
create table plano_aud (id int8 not null, rev int8 not null, revtype int2, nome varchar(255), quantidade_avaliacoes int4, valor_avaliacoes_excedentes numeric(19, 2), valor_mensal numeric(19, 2), primary key (id, rev));
alter table avaliavel drop constraint if exists UK9the15q1os1dpe8g46g5iko6e;
alter table avaliavel add constraint UK9the15q1os1dpe8g46g5iko6e unique (usuario_id, unidade_tipo_avaliacao_licenca_id);
alter table plano drop constraint if exists UKp2nhtb8lahhf978dchq19nby7;
alter table plano add constraint UKp2nhtb8lahhf978dchq19nby7 unique (quantidade_avaliacoes, valor_avaliacoes_excedentes, valor_mensal);
alter table plano drop constraint if exists UK_4v2mib9qybw6rnh3yn5n7j6ph;
alter table plano add constraint UK_4v2mib9qybw6rnh3yn5n7j6ph unique (nome);
alter table unidade_tipo_avaliacao_licenca drop constraint if exists UK9grgb4sl2fcmksrab75qpab61;
alter table unidade_tipo_avaliacao_licenca add constraint UK9grgb4sl2fcmksrab75qpab61 unique (unidade_tipo_avaliacao_id, licenca_id);
alter table unidade_tipo_avaliacao_licenca drop constraint if exists UKlnwfud1aghwanal8rbys7cq2k;
alter table unidade_tipo_avaliacao_licenca add constraint UKlnwfud1aghwanal8rbys7cq2k unique (unidade_tipo_avaliacao_id, licenca_id, ordem);
alter table assinatura add constraint FK6jimgux7sa47dn3vhhq570ucc foreign key (endereco_id) references endereco;
alter table assinatura_aud add constraint FKsdoeqhnanjxce7ytk7i2jq701 foreign key (rev) references public.revision;
alter table plano_aud add constraint FKplf42kuplmdwdod4pgjfcoml6 foreign key (rev) references public.revision;

