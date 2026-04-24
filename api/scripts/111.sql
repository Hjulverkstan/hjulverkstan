DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customer' AND column_name='is_deleted') THEN
        ALTER TABLE customer
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employee' AND column_name='is_deleted') THEN
        ALTER TABLE employee
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='location' AND column_name='is_deleted') THEN
        ALTER TABLE location
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop' AND column_name='is_deleted') THEN
        ALTER TABLE shop
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='story' AND column_name='is_deleted') THEN
        ALTER TABLE story
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;


    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ticket' AND column_name='is_deleted') THEN
        ALTER TABLE ticket
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_deleted') THEN
        ALTER TABLE users
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehicle' AND column_name='is_deleted') THEN
        ALTER TABLE vehicle
            ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;