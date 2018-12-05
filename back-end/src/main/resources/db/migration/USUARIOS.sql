INSERT INTO pessoa (id, created, nome)
 VALUES (1, NOW(), 'Administrador');

INSERT INTO usuario (id)
  VALUES (1);

INSERT INTO conta (created, email, esquema, administrador, root, password, usuario_id)
  VALUES (NOW(),'admin@assessment-online.com.br', 'public', true, true, '$2a$10$ZpR4ethoJ1Ne4Qn42OSX5euVeGi3tkrm4UwO6MlwZ5xCeOAoVB25m', 1);
