alter table configuracao add column feedback_obrigatorio boolean;
alter table configuracao_aud add column feedback_obrigatorio boolean;

alter table configuracao add column tipo_feedback integer;
alter table configuracao_aud add column tipo_feedback integer;
