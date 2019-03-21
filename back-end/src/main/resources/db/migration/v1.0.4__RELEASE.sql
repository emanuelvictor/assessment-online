ALTER TABLE sessao
  RENAME COLUMN created TO creation_time;

ALTER TABLE sessao
  RENAME COLUMN updated TO last_accessed_time;

ALTER TABLE sessao
  ALTER COLUMN id TYPE VARCHAR(500);

UPDATE sessao
SET id = sessao.token;

ALTER TABLE sessao
  DROP COLUMN token;
ALTER TABLE sessao
  DROP COLUMN validade;

-- DROP TABLE sessao_aud;
ALTER TABLE sessao_aud
  ALTER COLUMN id TYPE VARCHAR(500);
ALTER TABLE sessao_aud
  DROP COLUMN token;
ALTER TABLE sessao_aud
  DROP COLUMN validade;
ALTER TABLE sessao_aud
  ADD COLUMN creation_time timestamp without time zone;
ALTER TABLE sessao_aud
  ADD COLUMN last_accessed_time timestamp without time zone;


ALTER TABLE sessao
  ALTER COLUMN username DROP NOT NULL;
