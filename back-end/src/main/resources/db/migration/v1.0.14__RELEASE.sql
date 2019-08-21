ALTER TABLE unidade RENAME COLUMN quebrar_linha_na_selecao_de_iten_avaliavel TO quebrar_linha_na_selecao_de_item_avaliavel;
ALTER TABLE unidade_aud RENAME COLUMN quebrar_linha_na_selecao_de_iten_avaliavel TO quebrar_linha_na_selecao_de_item_avaliavel;

ALTER TABLE unidade DROP COLUMN latitude;
ALTER TABLE unidade DROP COLUMN longitude;

ALTER TABLE unidade_aud DROP COLUMN latitude;
ALTER TABLE unidade_aud DROP COLUMN longitude;
