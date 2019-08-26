ALTER TABLE avaliavel
    RENAME COLUMN unidade_tipo_avaliacao_id TO unidade_tipo_avaliacao_dispositivo_id;

ALTER TABLE avaliavel_aud
    RENAME COLUMN unidade_tipo_avaliacao_id TO unidade_tipo_avaliacao_dispositivo_id;

ALTER TABLE ONLY avaliavel
    DROP CONSTRAINT fk1wg1nljm73ixmvny30jwxv1nw;

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT fk1wg1nljm73ixmvny30jwxv1nw FOREIGN KEY (unidade_tipo_avaliacao_dispositivo_id) REFERENCES unidade_tipo_avaliacao_dispositivo (id);


ALTER TABLE operador
    RENAME COLUMN unidade_id TO dispositivo_id;

ALTER TABLE operador_aud
    RENAME COLUMN unidade_id TO dispositivo_id;

ALTER TABLE ONLY operador
    DROP CONSTRAINT fkmbui9o7f7r65qq4e8f1htnuyx;

ALTER TABLE ONLY operador
    ADD CONSTRAINT fkmbui9o7f7r65qq4e8f1htnuyx FOREIGN KEY (dispositivo_id) REFERENCES dispositivo (id);

ALTER TABLE ONLY operador
    DROP CONSTRAINT ukjk7g5klnw9709ku6wnplxuwxr;

ALTER TABLE ONLY operador
    ADD CONSTRAINT ukjk7g5klnw9709ku6wnplxuwxr UNIQUE (usuario_id, dispositivo_id);
