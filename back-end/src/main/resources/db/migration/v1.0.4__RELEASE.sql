ALTER TABLE conta DROP COLUMN usuario_id;

ALTER TABLE conta_aud DROP COLUMN usuario_id;

ALTER TABLE conta ADD COLUMN pessoa_id BIGINT;

ALTER TABLE conta_aud ADD COLUMN pessoa_id BIGINT;

ALTER TABLE pessoa ADD COLUMN conta_id BIGINT;

-- Adciona a CONSTRAINT de public.conta_id na tabela de pessoa
ALTER TABLE ONLY pessoa
  ADD CONSTRAINT fkm9ew1jp3jewapkiridletuerr FOREIGN KEY (conta_id) REFERENCES public.conta(id);

ALTER TABLE pessoa_aud ADD COLUMN conta_id BIGINT;




-- Dropa a CONSTRAINT da conta_id
ALTER TABLE ONLY usuario
  DROP CONSTRAINT fkm9ew1jp3jewapkiridletuerr;

-- Dropa a CONSTRAINT da pessoa_id (somente para recriar apontando para o public)
ALTER TABLE ONLY usuario
  DROP CONSTRAINT fknndxavgf8rogrx6jdmxbgm6s3;

-- Dropa a CONSTRAINT da avaliavel_id (somente para recriar apontando para o public)
ALTER TABLE ONLY avaliavel
  DROP CONSTRAINT fkp84hu90r7k1p8d7e4rt3vprsl;

-- Dropa a CONSTRAINT da operador_id (somente para recriar apontando para o public)
ALTER TABLE ONLY operador
  DROP CONSTRAINT fkajlncx53fcqxjpepj4dsogdel;





-- Adiciona novamente a CONSTRAINT de public.pessoa_id na tabela de usuário
ALTER TABLE ONLY usuario
  ADD CONSTRAINT fknndxavgf8rogrx6jdmxbgm6s3 FOREIGN KEY (id) REFERENCES public.pessoa(id);

-- Dropa a CONSTRAINT da pessoa_id da tabela auditada 'usuario_aud'
ALTER TABLE ONLY usuario_aud
  DROP CONSTRAINT fk6mi4t2e5o8cp9gsy77xqvsuii;

-- Adiciona a CONSTRAINT de public.pessoa_id na tabela auditada 'usuario_aud'
ALTER TABLE ONLY usuario_aud
  ADD CONSTRAINT fk6mi4t2e5o8cp9gsy77xqvsuii FOREIGN KEY (id, rev) REFERENCES public.pessoa_aud(id, rev);

ALTER TABLE usuario DROP COLUMN conta_id;

ALTER TABLE usuario_aud DROP COLUMN conta_id;
