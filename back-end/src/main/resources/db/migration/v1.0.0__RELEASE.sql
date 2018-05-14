--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.5
-- Dumped by pg_dump version 9.5.10

-- Started on 2017-12-13 15:05:19 -02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 8 (class 2615 OID 29924)
-- Name: auditing; Type: SCHEMA; Schema: -; Owner: sa_smafi_t
--

-- Cria o esquema público se ele não existir
CREATE SCHEMA IF NOT EXISTS public;

CREATE SCHEMA IF NOT EXISTS auditing;

ALTER SCHEMA auditing OWNER TO reactor;

--
-- TOC entry 2 (class 3079 OID 11859)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2173 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 1 (class 3079 OID 24645)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA pg_catalog;


--
-- TOC entry 2174 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET search_path = auditing, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;