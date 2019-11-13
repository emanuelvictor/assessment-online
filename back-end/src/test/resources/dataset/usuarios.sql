INSERT INTO conta (id, created, email, esquema, administrador, root, password)
VALUES (1, NOW(), 'admin@ubest.com.br', 'public', TRUE, TRUE,
        '$2a$10$ZpR4ethoJ1Ne4Qn42OSX5euVeGi3tkrm4UwO6MlwZ5xCeOAoVB25m');

INSERT INTO pessoa (id, created, nome)
VALUES (1, NOW(), 'Administrador');


INSERT INTO usuario (id, conta_id)
VALUES (1, 1);
