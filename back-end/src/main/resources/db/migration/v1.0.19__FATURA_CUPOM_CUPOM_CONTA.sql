-- wharever do hibernate -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

alter table dispositivo drop constraint if exists UKr55283g4kxb33wpywqic2bu13;
alter table dispositivo add constraint UKr55283g4kxb33wpywqic2bu13 unique (tenant, nome);
alter table avaliavel drop constraint if exists UK2y6jx7uetho4ipbisvvyfo210;
alter table avaliavel add constraint UK2y6jx7uetho4ipbisvvyfo210 unique (usuario_id, unidade_tipo_avaliacao_dispositivo_id);
alter table unidade_tipo_avaliacao_dispositivo drop constraint if exists UKaex8iqnj6gr507nejq8v48pv5;
alter table unidade_tipo_avaliacao_dispositivo add constraint UKaex8iqnj6gr507nejq8v48pv5 unique (unidade_tipo_avaliacao_id, dispositivo_id, ordem);

-- Cupom -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

create table cupom (id  bigserial not null, codigo varchar(150) not null, created timestamp not null, updated timestamp, primary key (id));
create table cupom_aud (id int8 not null, codigo varchar(150), rev int8 not null, revtype int2, primary key (id, rev));
alter table cupom drop constraint if exists unique_constraint_codigo;
alter table cupom add constraint unique_constraint_codigo unique (codigo);
alter table cupom_aud add constraint FKah81ra2app32enfw3abx7cawo foreign key (rev) references public.revision;

-- Desconto -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

create table desconto (id  bigserial not null, created timestamp not null, updated timestamp, data_vencimento date not null, percentual_desconto numeric(19, 2) not null, cupom_id int8 not null, conta_id int8 not null, primary key (id));
create table desconto_aud (id int8 not null, rev int8 not null, revtype int2, cupom_id int8, data_vencimento date, percentual_desconto numeric(19, 2), conta_id int8, primary key (id, rev));
alter table desconto drop constraint if exists UK1spja1p11o11mcc1c1ix1qtc1;
alter table desconto add constraint UK1spja1p11o11mcc1c1ix1qtc1 unique (cupom_id, conta_id);

-- Fatura -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

create table fatura (id  bigserial not null, created timestamp not null, updated timestamp, data_inicio date, data_pagamento date, data_termino date, link_boleto varchar(255), tenant varchar(150) not null, assinatura_id int8 not null, desconto_id int8, primary key (id));
create table fatura_aud (id int8 not null, rev int8 not null, revtype int2, data_inicio date, data_pagamento date, data_termino date, link_boleto varchar(255), tenant varchar(255), assinatura_id int8, desconto_id int8, primary key (id, rev));
alter table fatura drop constraint if exists UK_1u0ot1pv169mhi8d5plwc4oib;
alter table fatura add constraint UK_1u0ot1pv169mhi8d5plwc4oib unique (link_boleto);
alter table fatura add constraint FKdb4gtveanneiti2d869utamjl foreign key (assinatura_id) references assinatura;
alter table fatura add constraint FKo8dtp7m6pml44xvkj080k9yme foreign key (desconto_id) references public.desconto;
alter table fatura_aud add constraint FKlp9hb25syyvcyaspl4e91iwm foreign key (rev) references public.revision;
