SET search_path TO public;

create extension if not exists "uuid-ossp";

TRUNCATE public.dispositivo CASCADE;

INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (3, '2019-11-12 11:42:25.716376', NULL, 'Blumenau - Shopping Neumarkt', 100002, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '115public', NULL, true, '733def0e-1f4e-471d-9648-713970299f20', (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (4, '2019-11-12 11:42:25.716376', NULL, 'Foz do Iguaçu - Cataratas JL Shopping', 100003, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '116public', NULL, true, '84d6d2ac-a286-485b-b508-84b70c3075dc', '2018-11-12 11:42:25.716376');
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (5, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Curitiba', 100004, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '117public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (6, '2019-11-12 11:42:25.716376', NULL, 'Cascavel - Shopping JL', 100005, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '118public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (7, '2019-11-12 11:42:25.716376', NULL, 'Balneário Camboriú - Shopping Balneário', 100006, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '119public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (8, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Palladium', 100007, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '120public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (9, '2019-11-12 11:42:25.716376', NULL, 'São José - Shopping Continente', 100008, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '122public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (11, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Muffato Tarumã', 100010, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '124public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (12, '2019-11-12 11:42:25.716376', NULL, 'Foz do Iguaçu - BIG', 100011, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '125public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (13, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Angeloni Água Verde', 100012, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '126public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (14, '2019-11-12 11:42:25.716376', NULL, 'Londrina - Shopping Boulevard', 100013, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '127public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (15, '2019-11-12 11:42:25.716376', NULL, 'Maringá - Avenida Center', 100014, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '128public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (16, '2019-11-12 11:42:25.716376', NULL, 'São José dos Pinhais - Shopping São José', 100015, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '121public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (17, '2019-11-12 11:42:25.716376', NULL, 'São Paulo - Shopping Vila Olímpia ', 100016, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '196public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (18, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Estação', 100017, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '129public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (19, '2019-11-12 11:42:25.716376', NULL, 'Foz do Iguaçu - Catuaí Paladium', 100018, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '112public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (20, '2019-11-12 11:42:25.716376', NULL, 'Florianópolis - Angeloni Beira Mar', 100019, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '205public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (21, '2019-11-12 11:42:25.716376', NULL, 'São Bernardo do Campo - Extra Anchieta', 100020, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '131public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (22, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Barigui', 100021, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '132public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (23, '2019-11-12 11:42:25.716376', NULL, 'Londrina - Aurora Shopping', 100022, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '136public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (24, '2019-11-12 11:42:25.716376', NULL, 'Joinville - Shopping Mueller', 100023, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '181public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (25, '2019-11-12 11:42:25.716376', NULL, 'Rio de Janeiro - Shopping Tijuca', 100024, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '130public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (26, '2019-11-12 11:42:25.716376', NULL, 'Rio de Janeiro - Rio Sul', 100025, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '195public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (27, '2019-11-12 11:42:25.716376', NULL, 'Presidente Prudente - Prudenshopping', 100026, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '166public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (28, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Omar', 100027, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '168public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (29, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Shopping Crystal', 100028, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '169public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (30, '2019-11-12 11:42:25.716376', NULL, 'Curitiba - Jockey Plaza Shopping', 100029, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '174public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (31, '2019-11-12 11:42:26.187655', NULL, 'T-Protege Palotina', 100030, 1, NULL, NULL, true, true, true, 30, 'contato@tprotege.com.br', NULL, '20contato@tprotege.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (32, '2019-11-12 11:42:26.187655', NULL, 'T-Protege Toledo', 100031, 1, NULL, NULL, true, true, true, 30, 'contato@tprotege.com.br', NULL, '22contato@tprotege.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (33, '2019-11-12 11:42:26.187655', NULL, 'T-Protege Foz', 100032, 1, NULL, NULL, true, true, true, 30, 'contato@tprotege.com.br', NULL, '23contato@tprotege.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (34, '2019-11-12 11:42:26.187655', NULL, 'T-Protege Cascavel', 100033, 1, NULL, NULL, true, true, true, 30, 'contato@tprotege.com.br', NULL, '29contato@tprotege.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (35, '2019-11-12 11:42:26.187655', NULL, 'T-Protege Medianeira', 100034, 1, NULL, NULL, true, true, true, 30, 'contato@tprotege.com.br', NULL, '30contato@tprotege.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (36, '2019-11-12 11:42:26.660453', NULL, 'Unidade Centro', 100035, 1, NULL, NULL, true, true, true, 30, 'exemplo@empresa.com', NULL, '11exemplo@empresa.com', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (37, '2019-11-12 11:42:26.660453', NULL, 'Femai 2019', 100036, 1, NULL, NULL, true, true, true, 30, 'exemplo@empresa.com', NULL, '23exemplo@empresa.com', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (38, '2019-11-12 11:42:27.65936', NULL, 'HOSPITAL INFANTIL PEQUENO PRINCIPE ', 100037, 1, NULL, NULL, true, true, true, 30, 'ubest@pequenoprincipe.org.br', NULL, '11ubest@pequenoprincipe.org.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (39, '2019-11-12 11:42:28.140548', NULL, 'Centro', 100038, 1, NULL, NULL, true, true, true, 30, 'filezao@filezao.com.br', NULL, '11filezao@filezao.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (40, '2019-11-12 11:42:28.140548', NULL, 'Jardim', 100039, 1, NULL, NULL, true, true, true, 30, 'filezao@filezao.com.br', NULL, '13filezao@filezao.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (41, '2019-11-12 11:42:28.640873', NULL, 'Plantão', 100040, 1, NULL, NULL, true, true, true, 30, 'qualidade@semprevida.com.br', NULL, '11qualidade@semprevida.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (42, '2019-11-12 11:42:28.640873', NULL, 'Atendimento Central', 100041, 1, NULL, NULL, true, true, true, 30, 'qualidade@semprevida.com.br', NULL, '13qualidade@semprevida.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (43, '2019-11-12 11:42:29.081559', NULL, 'Refúgio Biológico', 100042, 1, NULL, NULL, true, true, true, 30, 'ubest@turismoitaipu.com.br', NULL, '13ubest@turismoitaipu.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (44, '2019-11-12 11:42:29.081559', NULL, 'JL Shopping', 100043, 1, NULL, NULL, true, true, true, 30, 'ubest@turismoitaipu.com.br', NULL, '11ubest@turismoitaipu.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (45, '2019-11-12 11:42:29.759202', NULL, 'Festival das Cataratas', 100044, 1, NULL, NULL, true, true, true, 30, 'deangelieventos@gmail.com', NULL, '11deangelieventos@gmail.com', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (46, '2019-11-12 11:42:29.759202', NULL, 'Fórum de Turismo', 100045, 1, NULL, NULL, true, true, true, 30, 'deangelieventos@gmail.com', NULL, '13deangelieventos@gmail.com', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (47, '2019-11-12 11:42:30.422748', NULL, 'Minha primeira unidade', 100046, 1, NULL, NULL, true, true, true, 30, 'ubest@maxiclin.com.br', NULL, '11ubest@maxiclin.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (48, '2019-11-12 11:42:30.917204', NULL, 'Sódupé Calçados', 100047, 1, NULL, NULL, true, true, true, 30, 'ubest@sodupe.com.br', NULL, '26ubest@sodupe.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (2, '2019-11-12 11:42:25.716376', '2019-11-12 13:13:10.676446', 'Curitiba - Shopping Jardim das Américas', 100001, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '114public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (10, '2019-11-12 11:42:25.716376', '2019-11-12 13:26:39.615307', 'Canoas - Park Shopping Canoas', 100009, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '123public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (49, '2019-11-12 11:42:31.204079', NULL, 'Restaurante', 100048, 1, NULL, NULL, true, true, true, 30, 'gerenciaoperacional@olindahoteleventos.com.br', NULL, '11gerenciaoperacional@olindahoteleventos.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (50, '2019-11-12 11:42:31.510532', NULL, 'Auto Peças Foz', 100049, 1, NULL, NULL, true, true, true, 30, 'alisson@autopecasfoz.com.br', NULL, '13alisson@autopecasfoz.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (51, '2019-11-12 11:42:31.792113', NULL, 'Minha primeira unidade', 100050, 1, NULL, NULL, true, true, true, 30, 'nivaldo_miotto@terra.com.br', NULL, '11nivaldo_miotto@terra.com.br', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (1, '2019-11-12 11:42:25.716376', '2019-11-12 13:21:42.31864', 'Joinville - Angeloni João Colin', 100000, 1, NULL, NULL, true, true, true, 30, 'public', NULL, '113public', NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (52, '2019-11-12 13:27:02.634212', NULL, 'teste', 100051, 1, NULL, NULL, true, true, true, 30, 'public', NULL, NULL, NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
INSERT INTO public.dispositivo (id, created, updated, nome, numero_licenca, assinatura_id, latitude, longitude, modo_insonia, modo_quiosque, quebrar_linha_na_selecao_de_item_avaliavel, "time", tenant, senha, unidade_id, numero_serie, ativo, codigo, codigo_expiration) VALUES (1000, '2019-11-13 09:09:53.067235', NULL, 'Foz - Shopping Neumarkt', 101000, 1, NULL, NULL, true, true, true, 30, 'public', NULL, NULL, NULL, true, (uuid_generate_v4()), (SELECT now() + '1 hour'::interval));
