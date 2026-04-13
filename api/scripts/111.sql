DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customer' AND column_name='is_archived') THEN
        ALTER TABLE customer
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employee' AND column_name='is_archived') THEN
        ALTER TABLE employee
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='location' AND column_name='is_archived') THEN
        ALTER TABLE location
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop' AND column_name='is_archived') THEN
        ALTER TABLE shop
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='story' AND column_name='is_archived') THEN
        ALTER TABLE story
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;


    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ticket' AND column_name='is_archived') THEN
        ALTER TABLE ticket
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_archived') THEN
        ALTER TABLE users
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicle' AND column_name='is_archived') THEN
        ALTER TABLE vehicle
            ADD COLUMN archived BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;