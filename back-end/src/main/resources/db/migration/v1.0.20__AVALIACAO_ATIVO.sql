ALTER TABLE agrupador
    ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT TRUE;

ALTER TABLE agrupador_aud
    ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT TRUE;

ALTER TABLE dispositivo
    ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT TRUE;

ALTER TABLE dispositivo_aud
    ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT TRUE;


alter table configuracao drop column time;
alter table configuracao_aud drop column time;
