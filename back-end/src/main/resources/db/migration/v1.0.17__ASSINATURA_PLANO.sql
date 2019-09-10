alter table assinatura add column plano_id bigint not null default 1;
alter table assinatura_aud add column plano_id bigint not null default 1;

alter table assinatura add constraint fk_plano_id foreign key (plano_id) references public.plano;
