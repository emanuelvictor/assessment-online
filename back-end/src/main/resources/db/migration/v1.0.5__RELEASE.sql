DROP TABLE sessao CASCADE;
DROP TABLE sessao_aud CASCADE;

ALTER TABLE configuracao ADD COLUMN feedback BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE configuracao ADD COLUMN feedback_enunciado VARCHAR(255);
ALTER TABLE configuracao_aud ADD COLUMN feedback BOOLEAN;
ALTER TABLE configuracao_aud ADD COLUMN feedback_enunciado VARCHAR(255);

ALTER TABLE pessoa ALTER COLUMN nome SET NOT NULL;
ALTER TABLE pessoa ADD CONSTRAINT documento_unique UNIQUE (documento);
