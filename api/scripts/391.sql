-- 1) Create translation_set
create table translation_set (
                                 id bigint primary key,
                                 lang varchar(255) not null
);

-- 2) Rename localised_content -> translation
alter table localised_content rename to translation;

alter table translation add column translation_set_id bigint;

-- 3) Add FK from translation.translation_set_id -> translation_set.id
alter table translation
    add constraint fk_translation_translation_set
        foreign key (translation_set_id) references translation_set(id);

-- 4) Add unique constraint (translation_set_id, field_name)
alter table translation
    add constraint uk_translation_set_field
        unique (translation_set_id, field_name);

-- 5) Add index on translation_set_id
create index ix_localised_content_set
    on translation (translation_set_id);