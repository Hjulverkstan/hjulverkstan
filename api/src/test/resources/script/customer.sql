INSERT INTO Customer
(id, customer_type,  first_name, last_name,  personal_identity_number,    organization_name,phone_number,    email,                  created_at, updated_at, created_by, updated_by) VALUES
(1, 'PERSON',       'Tuva',     'Nilsson',  '19900101-1237',             null,             '+46798382301',  'tuva@example.com',     '2024-05-16 10:00:00',      NOW(),      1,          1         ),
(2, 'PERSON',       'Emil',     'Berglund', '19851224-5672',             null,             '+46832103988',  'emil@example.com',     '2024-05-17 10:00:00',      NOW(),      1,          1         ),
(3, 'ORGANIZATION', 'Bosse',    'Boström',  '20030515-9018',             'Biltema',        '+46798381201',  'bosseboss@biltema.se', '2024-05-18 10:00:00',      NOW(),      1,          1         );