Create or replace function random_string(length integer) returns text as
$$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9}';
  result text := '';
  i integer := 0;
begin
  if length < 0 then
    raise exception 'Given length cannot be less than 0';
  end if;
  for i in 1..length loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$ language plpgsql;

alter table licenca rename codigo to nome;
alter table licenca_aud rename codigo to nome;

alter table licenca add column latitude numeric(19, 2);
alter table licenca add column longitude numeric(19, 2);
alter table licenca add column modo_insonia boolean not null default false;
alter table licenca add column modo_quiosque boolean not null  default false;
alter table licenca add column quebrar_linha_na_selecao_de_item_avaliavel boolean not null default false;
alter table licenca add column time int2 not null check(time>=5 AND time<=600) default 30;
alter table licenca add column codigo varchar(10) not null default random_string(8);
alter table licenca add column tenant varchar(150) not null default current_schema();
alter table licenca_aud add column tenant varchar(150) default current_schema();
alter table licenca_aud add column codigo varchar(10);
alter table licenca_aud add column latitude numeric(19, 2);
alter table licenca_aud add column longitude numeric(19, 2);
alter table licenca_aud add column modo_insonia boolean;
alter table licenca_aud add column modo_quiosque boolean;
alter table licenca_aud add column quebrar_linha_na_selecao_de_item_avaliavel boolean;
alter table licenca_aud add column time int2;


alter table licenca drop constraint if exists UK_tcudt9flboi41o17wagkwx8tw;
alter table licenca add constraint UK_tcudt9flboi41o17wagkwx8tw unique (codigo);

alter table licenca drop constraint if exists licenca_tenant_nome_unique;
alter table licenca add constraint licenca_tenant_nome_unique unique (nome, tenant);

