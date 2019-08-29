create table licenca (id  bigserial not null, created timestamp not null, updated timestamp, codigo varchar(150) not null, publico boolean not null, primary key (id));
create table licenca_aud (id int8 not null, rev int8 not null, revtype int2, codigo varchar(150), publico boolean, primary key (id, rev));
create table unidade_tipo_avaliacao_licenca_aud (id int8 not null, rev int8 not null, revtype int2, ativo boolean, ordem int2, licenca_id int8, unidade_tipo_avaliacao_id int8, primary key (id, rev));
create table unidade_tipo_avaliacao_licenca (id  bigserial not null, created timestamp not null, updated timestamp, ativo boolean not null, ordem int2, licenca_id int8 not null, unidade_tipo_avaliacao_id int8 not null, primary key (id));
alter table licenca drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table licenca add constraint UK_tcudt9flboi41o17wagkwx8tw unique (codigo);
alter table unidade_tipo_avaliacao_licenca drop constraint if exists UKli1jamrtf9006goepkinibpo2;
alter table unidade_tipo_avaliacao_licenca add constraint UKli1jamrtf9006goepkinibpo2 unique (unidade_tipo_avaliacao_id, licenca_id);
alter table unidade_tipo_avaliacao_licenca drop constraint if exists UKcdje95t2heav6arkqvwwjxm5c;

alter table unidade_tipo_avaliacao_licenca add constraint UKcdje95t2heav6arkqvwwjxm5c unique (licenca_id, ordem);
alter table licenca_aud add constraint FKea59wma882p0pwak1gc939lfa foreign key (rev) references public.revision;
alter table unidade_tipo_avaliacao_licenca_aud add constraint FK9054nel78bl424lyvxt78byep foreign key (rev) references public.revision;
alter table unidade_tipo_avaliacao_licenca add constraint FKl9hea59r09t9mewuo74l1yqj4 foreign key (licenca_id) references licenca;
alter table unidade_tipo_avaliacao_licenca add constraint FK5vxq5vkng3gjeo0bh644ejnuq foreign key (unidade_tipo_avaliacao_id) references unidade_tipo_avaliacao;
