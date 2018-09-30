ALTER TABLE configuracao ADD COLUMN um character varying(255);
ALTER TABLE configuracao ADD COLUMN dois character varying(255);
ALTER TABLE configuracao ADD COLUMN tres character varying(255);
ALTER TABLE configuracao ADD COLUMN quatro character varying(255);
ALTER TABLE configuracao ADD COLUMN cinco character varying(255);

ALTER TABLE configuracao_aud ADD COLUMN um character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN dois character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN tres character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN quatro character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN cinco character varying(255);


INSERT INTO configuracao (created, um, dois, tres, quatro, cinco)
  VALUES (NOW(), 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Ótimo');
