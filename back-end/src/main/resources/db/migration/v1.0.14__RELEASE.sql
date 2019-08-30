-- Insere os licencas de acordo com as unidades
INSERT INTO licenca (id, created, nome, publico, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel, tenant, codigo)
    (
        SELECT  (unidade.id) as ide, NOW() AS created, pessoa.nome AS nome, false AS publico, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel, current_schema(), random_string(8)
        FROM unidade
                 INNER JOIN pessoa ON pessoa.id = unidade.id
    );

-- Insere os unidade-tipo-avaliacao-licenca de acordo com as unidades
INSERT INTO unidade_tipo_avaliacao_licenca (id, created, ordem, unidade_tipo_avaliacao_id, licenca_id, ativo)
    (
        SELECT  (unidade_tipo_avaliacao.id) as ide, NOW() AS created, 1 AS ordem, unidade_tipo_avaliacao.id AS unidade_tipo_avaliacao_id, unidade.id AS licenca_id, true AS ativo
        FROM unidade
                 INNER JOIN unidade_tipo_avaliacao ON unidade_tipo_avaliacao.unidade_id = unidade.id
    );
