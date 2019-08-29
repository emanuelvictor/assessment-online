-- Insere os licencas de acordo com as unidades
INSERT INTO licenca (id, created, nome, publico, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel)
    (
        SELECT  (unidade.id) as ide, NOW() AS created, pessoa.nome AS nome, false AS publico, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel
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


-- INSERT INTO unidade (id, publico, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel)
--     (
--         SELECT id as id, false AS publico, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel
--         FROM pessoa
--         WHERE (nome LIKE 'Unidade filha%')
--     );
--
-- -- SELECT * FROM unidade_tipo_avaliacao
--
-- UPDATE
--     unidade_tipo_avaliacao
-- SET
--     unidade_id = (unidade_id + 10000);
--
-- -- SELECT * FROM unidade
-- -- 	INNER JOIN pessoa ON pessoa.id = unidade.id
-- -- WHERE pessoa.nome LIKE 'Unidade%'
--
-- UPDATE
--     unidade as that
-- SET
--     unidade_superior_id = (that.id - 10000)
-- FROM
--     unidade as unidade_inner
--         INNER JOIN pessoa
--                    ON (pessoa.id = unidade_inner.id AND pessoa.id > 10000)
-- WHERE that.id > 10000;
--
-- -- SELECT * FROM unidade
-- -- 	INNER JOIN pessoa ON pessoa.id = unidade.id
-- -- WHERE pessoa.nome LIKE 'Unidade%'
