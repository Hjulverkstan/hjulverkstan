package se.hjulverkstan.main.util;

import org.springframework.jdbc.core.JdbcTemplate;

public class SequenceUtils {

    public static void resetAllSequences(JdbcTemplate jdbcTemplate) {
        String sql = """
            DO $$
            DECLARE
                r RECORD;
            BEGIN
                FOR r IN 
                    SELECT 
                        c.relname as seq_name,
                        t.relname as table_name
                    FROM pg_class c
                    JOIN pg_depend d ON d.objid = c.oid
                    JOIN pg_class t ON d.refobjid = t.oid
                    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
                    WHERE c.relkind = 'S' AND a.attname = 'id'
                LOOP
                    EXECUTE format('SELECT setval(''%I'', COALESCE( (SELECT MAX(id) FROM %I), 0 ) + 1 )', r.seq_name, r.table_name);
                END LOOP;
            END $$;
        """;

        jdbcTemplate.execute(sql);
    }
}
