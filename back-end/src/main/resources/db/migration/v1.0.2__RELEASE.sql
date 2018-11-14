ALTER TABLE configuracao ADD COLUMN um character varying(255);
ALTER TABLE configuracao ADD COLUMN dois character varying(255);
ALTER TABLE configuracao ADD COLUMN tres character varying(255);
ALTER TABLE configuracao ADD COLUMN quatro character varying(255);
ALTER TABLE configuracao ADD COLUMN cinco character varying(255);
ALTER TABLE configuracao ADD COLUMN logo bytea;
ALTER TABLE configuracao ADD COLUMN logo_Path character varying(255);
ALTER TABLE configuracao ADD COLUMN background_image bytea;
ALTER TABLE configuracao ADD COLUMN background_image_path character varying(255);
ALTER TABLE configuracao ADD COLUMN agradecimento character varying(255);

ALTER TABLE configuracao_aud ADD COLUMN um character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN dois character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN tres character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN quatro character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN cinco character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN logo bytea;
ALTER TABLE configuracao_aud ADD COLUMN logo_Path character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN background_image bytea;
ALTER TABLE configuracao_aud ADD COLUMN background_image_path character varying(255);
ALTER TABLE configuracao_aud ADD COLUMN agradecimento character varying(255);

INSERT INTO configuracao (created, um, dois, tres, quatro, cinco, agradecimento)
  VALUES (NOW(), 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Obrigado pela participação');
