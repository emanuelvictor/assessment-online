CREATE OR REPLACE FUNCTION filter(needles text, VARIADIC haystacks text [])
  RETURNS boolean AS $$
SELECT needles IS NULL OR trim(needles) = '' OR EXISTS(
    SELECT DISTINCT 1
    FROM unnest(haystacks) haystack,
          unnest(string_to_array(needles, ',')) needle
    WHERE unaccent(haystack) ILIKE '%' || unaccent(needle) || '%');
$$ LANGUAGE SQL;
