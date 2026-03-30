-- 1. Create account_type enum (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');
    END IF;
END$$;

-- 2. Create account table
CREATE TABLE IF NOT EXISTS public.account
(
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR NOT NULL,
    account_lastname VARCHAR NOT NULL,
    account_email VARCHAR NOT NULL,
    account_password VARCHAR NOT NULL,  -- must provide password in inserts
    account_type account_type NOT NULL DEFAULT 'Client',
    notes TEXT
);

-- 3. Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, notes)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Iam1ronM@n');