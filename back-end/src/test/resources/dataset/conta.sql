SET search_path TO public;

INSERT INTO public.conta (id, created, email, esquema, administrador, root, password)
    VALUES (1, NOW(), 'contato@bubblemixtea.com.br', 'contato@bubblemixtea.com.br', TRUE, false, '$2a$10$ZpR4ethoJ1Ne4Qn42OSX5euVeGi3tkrm4UwO6MlwZ5xCeOAoVB25m');

INSERT INTO public.conta (id, created, email, esquema, administrador, root, password)
    VALUES (2, NOW(), 'rodrigo.pfontes@bubblemixtea.com.br', 'contato@bubblemixtea.com.br', false, false, '$2a$10$ZpR4ethoJ1Ne4Qn42OSX5euVeGi3tkrm4UwO6MlwZ5xCeOAoVB25m');

INSERT INTO public.conta (id, created, email, esquema, administrador, root, password)
    VALUES (3, NOW(), 'dhiego@bubblemixtea.com.br', 'contato@bubblemixtea.com.br', false, false, '$2a$10$ZpR4ethoJ1Ne4Qn42OSX5euVeGi3tkrm4UwO6MlwZ5xCeOAoVB25m');
