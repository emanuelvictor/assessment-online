alter table configuracao add column quebrar_linha_na_selecao_de_iten_avaliavel boolean not null DEFAULT false;
alter table configuracao_aud add column quebrar_linha_na_selecao_de_iten_avaliavel boolean;
