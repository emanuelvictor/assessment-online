-- SET search_path = "exemplo@empresa.com";

-- SELECT * FROM unidade
--                   INNER JOIN pessoa ON pessoa.id = unidade.id

INSERT INTO pessoa (id, created, nome)
    (
        SELECT  (unidade.id + 10000) as ide, NOW() AS created, concat('Unidade filha: ' , pessoa.nome) AS nome
        FROM unidade
                 LEFT OUTER JOIN pessoa ON pessoa.id = unidade.id
    );

INSERT INTO unidade (id, publico, modo_quiosque, modo_insonia, time, quebrar_linha_na_selecao_de_item_avaliavel)
    (
        SELECT id as id, false AS publico, false AS modo_quiosque, false AS modo_insonia, 30 AS time, false AS quebrar_linha_na_selecao_de_item_avaliavel
        FROM pessoa
        WHERE (nome LIKE 'Unidade filha%')
    );

-- SELECT * FROM unidade_tipo_avaliacao

UPDATE
    unidade_tipo_avaliacao
SET
    unidade_id = (unidade_id + 10000);

-- SELECT * FROM unidade 
-- 	INNER JOIN pessoa ON pessoa.id = unidade.id
-- WHERE pessoa.nome LIKE 'Unidade%'

UPDATE
    unidade as that
SET
    unidade_superior_id = (that.id - 10000)
FROM
    unidade as unidade_inner
        INNER JOIN pessoa
                   ON (pessoa.id = unidade_inner.id AND pessoa.id > 10000)
WHERE that.id > 10000;

-- SELECT * FROM unidade 
-- 	INNER JOIN pessoa ON pessoa.id = unidade.id
-- WHERE pessoa.nome LIKE 'Unidade%'
