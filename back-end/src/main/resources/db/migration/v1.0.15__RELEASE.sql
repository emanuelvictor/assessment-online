ALTER TABLE avaliavel
    RENAME COLUMN unidade_tipo_avaliacao_id TO unidade_tipo_avaliacao_dispositivo_id;

ALTER TABLE avaliavel_aud
    RENAME COLUMN unidade_tipo_avaliacao_id TO unidade_tipo_avaliacao_dispositivo_id;

ALTER TABLE ONLY avaliavel
    DROP CONSTRAINT fk1wg1nljm73ixmvny30jwxv1nw;

ALTER TABLE ONLY avaliavel
    ADD CONSTRAINT fk1wg1nljm73ixmvny30jwxv1nw FOREIGN KEY (unidade_tipo_avaliacao_dispositivo_id) REFERENCES unidade_tipo_avaliacao_dispositivo (id);
