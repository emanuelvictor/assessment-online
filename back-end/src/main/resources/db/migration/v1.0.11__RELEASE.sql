create table dispositivo (id  bigserial not null, created timestamp not null, updated timestamp, codigo varchar(150) not null, publico boolean not null, primary key (id));
create table dispositivo_aud (id int8 not null, rev int8 not null, revtype int2, codigo varchar(150), publico boolean, primary key (id, rev));
create table unidade_tipo_avaliacao_dispositivo_aud (id int8 not null, rev int8 not null, revtype int2, ativo boolean, ordem int2, dispositivo_id int8, unidade_tipo_avaliacao_id int8, primary key (id, rev));
create table unidade_tipo_avaliacao_dispositivo (id  bigserial not null, created timestamp not null, updated timestamp, ativo boolean not null, ordem int2, dispositivo_id int8 not null, unidade_tipo_avaliacao_id int8 not null, primary key (id));
alter table dispositivo drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table dispositivo add constraint UK_tcudt9flboi41o17wagkwx8tw unique (codigo);
alter table unidade_tipo_avaliacao_dispositivo drop constraint if exists UKli1jamrtf9006goepkinibpo2;
alter table unidade_tipo_avaliacao_dispositivo add constraint UKli1jamrtf9006goepkinibpo2 unique (unidade_tipo_avaliacao_id, dispositivo_id);
alter table unidade_tipo_avaliacao_dispositivo drop constraint if exists UKcdje95t2heav6arkqvwwjxm5c;

alter table unidade_tipo_avaliacao_dispositivo add constraint UKcdje95t2heav6arkqvwwjxm5c unique (dispositivo_id, ordem);
alter table dispositivo_aud add constraint FKea59wma882p0pwak1gc939lfa foreign key (rev) references public.revision;
alter table unidade_tipo_avaliacao_dispositivo_aud add constraint FK9054nel78bl424lyvxt78byep foreign key (rev) references public.revision;
alter table unidade_tipo_avaliacao_dispositivo add constraint FKl9hea59r09t9mewuo74l1yqj4 foreign key (dispositivo_id) references dispositivo;
alter table unidade_tipo_avaliacao_dispositivo add constraint FK5vxq5vkng3gjeo0bh644ejnuq foreign key (unidade_tipo_avaliacao_id) references unidade_tipo_avaliacao;
