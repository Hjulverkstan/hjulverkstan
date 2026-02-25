-- Migration 391: Introduce translation_set + identity, unify translation lookup
--
-- Starts from the old schema where:
--   - localised_content: id, lang, field_name, field_type, content, auditable, story_id, shop_id, text_id
--   - story: id, title, slug, body_text, imageurl, auditable  (no identity_id)
--   - shop:  id, name, address, ..., auditable                (no identity_id)
--   - text:  id, key, auditable                               (no identity_id)

-- Add identity_id to entity tables. The temp default fills existing rows immediately.
ALTER TABLE story ADD COLUMN identity_id UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE shop  ADD COLUMN identity_id UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE text  ADD COLUMN identity_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Create the identity table that backs the Identity JPA entity.
-- It tracks which entity type (STORY / SHOP / TEXT) each identity_id belongs to,
-- which is what the countLangByEntity query joins on.
CREATE TABLE identity (
    id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    entity VARCHAR(255) NOT NULL
);

-- Seed identity rows from every existing entity.
INSERT INTO identity (id, entity) SELECT identity_id, 'STORY' FROM story;
INSERT INTO identity (id, entity) SELECT identity_id, 'SHOP'  FROM shop;
INSERT INTO identity (id, entity) SELECT identity_id, 'TEXT'  FROM text;

-- Drop the temp defaults — new entities set identity_id explicitly via the service layer.
ALTER TABLE story ALTER COLUMN identity_id DROP DEFAULT;
ALTER TABLE shop  ALTER COLUMN identity_id DROP DEFAULT;
ALTER TABLE text  ALTER COLUMN identity_id DROP DEFAULT;

-- Rename localised_content -> translation.
ALTER TABLE localised_content RENAME TO translation;

-- Create translation_set. One row per (identity_id, language) pair.
-- Mirrors the TranslationSet JPA entity including its Auditable columns.
CREATE TABLE translation_set (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identity_id UUID         NOT NULL REFERENCES identity(id),
    lang        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,
    created_by  BIGINT       NOT NULL,
    updated_by  BIGINT       NOT NULL,
    CONSTRAINT uk_translation_set_identity_lang UNIQUE (identity_id, lang)
);

-- Populate translation_set from existing localised_content data.
-- Group by (entity identity_id, lang) so we get one set per entity per language.
INSERT INTO translation_set (identity_id, lang, created_at, updated_at, created_by, updated_by)
SELECT s.identity_id, t.lang,
       MIN(t.created_at), MIN(t.updated_at), MIN(t.created_by), MIN(t.updated_by)
FROM translation t
JOIN story s ON s.id = t.story_id
WHERE t.story_id IS NOT NULL
GROUP BY s.identity_id, t.lang;

INSERT INTO translation_set (identity_id, lang, created_at, updated_at, created_by, updated_by)
SELECT sh.identity_id, t.lang,
       MIN(t.created_at), MIN(t.updated_at), MIN(t.created_by), MIN(t.updated_by)
FROM translation t
JOIN shop sh ON sh.id = t.shop_id
WHERE t.shop_id IS NOT NULL
GROUP BY sh.identity_id, t.lang;

INSERT INTO translation_set (identity_id, lang, created_at, updated_at, created_by, updated_by)
SELECT tx.identity_id, t.lang,
       MIN(t.created_at), MIN(t.updated_at), MIN(t.created_by), MIN(t.updated_by)
FROM translation t
JOIN text tx ON tx.id = t.text_id
WHERE t.text_id IS NOT NULL
GROUP BY tx.identity_id, t.lang;

-- Add translation_set_id to translation and back-fill from the entity FK columns.
ALTER TABLE translation ADD COLUMN translation_set_id BIGINT;

UPDATE translation t
SET translation_set_id = ts.id
FROM translation_set ts
JOIN story s ON s.identity_id = ts.identity_id
WHERE t.story_id = s.id AND t.lang = ts.lang;

UPDATE translation t
SET translation_set_id = ts.id
FROM translation_set ts
JOIN shop sh ON sh.identity_id = ts.identity_id
WHERE t.shop_id = sh.id AND t.lang = ts.lang;

UPDATE translation t
SET translation_set_id = ts.id
FROM translation_set ts
JOIN text tx ON tx.identity_id = ts.identity_id
WHERE t.text_id = tx.id AND t.lang = ts.lang;

-- Lock down translation_set_id and add the FK + unique constraint + index.
ALTER TABLE translation ALTER COLUMN translation_set_id SET NOT NULL;

ALTER TABLE translation
    ADD CONSTRAINT fk_translation_translation_set
        FOREIGN KEY (translation_set_id) REFERENCES translation_set(id);

ALTER TABLE translation
    ADD CONSTRAINT uk_translation_set_field
        UNIQUE (translation_set_id, field_name);

CREATE INDEX ix_localised_content_set ON translation (translation_set_id);

-- Drop the old entity-FK and lang columns from translation — no longer needed.
-- Dropping a column in PostgreSQL automatically removes any FK constraints on it.
ALTER TABLE translation DROP COLUMN lang;
ALTER TABLE translation DROP COLUMN story_id;
ALTER TABLE translation DROP COLUMN shop_id;
ALTER TABLE translation DROP COLUMN text_id;

-- Drop the old direct body_text column from story; content now lives in translation.
ALTER TABLE story DROP COLUMN body_text;
