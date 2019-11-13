SET search_path TO public;

TRUNCATE public.assinatura CASCADE;

INSERT INTO public.assinatura (id, created, updated, forma_pagamento, client_id, mes_validade, ano_validade, data_vencimento, numero_cartao, nome_titular, hash, documento_titular, agrupar_faturas, sou_empresa, cancelada, dia_vencimento_fatura, data_nascimento_titular, codigo_area, telefone, endereco_id, plano_id) VALUES (1, '2019-11-12 11:42:16.827352', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, false, 5, NULL, NULL, NULL, NULL, 1);
