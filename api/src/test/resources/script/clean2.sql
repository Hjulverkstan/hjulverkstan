-- cleanup.sql
DO $$
    BEGIN
        -- Try dynamic approach first
        BEGIN
            PERFORM (SELECT 1 FROM pg_tables WHERE schemaname = current_schema() LIMIT 1);

            -- If the above succeeds, dynamic approach should work
            EXECUTE (
                SELECT string_agg('TRUNCATE TABLE ' || quote_ident(tablename) || ' RESTART IDENTITY CASCADE', '; ')
                FROM pg_tables
                WHERE schemaname = current_schema()
                  AND tablename NOT LIKE 'flyway%'
                  AND tablename NOT LIKE 'databasechangelog%'
            );

            RAISE NOTICE 'Used dynamic table truncation';
        EXCEPTION WHEN others THEN
            -- Fall back to static list if dynamic fails
            TRUNCATE TABLE location, open_hours, shop, vehicle, general_content RESTART IDENTITY CASCADE;
            RAISE NOTICE 'Used static table truncation';
        END;
    END $$;