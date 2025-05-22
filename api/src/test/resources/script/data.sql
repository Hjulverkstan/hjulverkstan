-- SEED Table

INSERT INTO employee
(first_name,              last_name,              phone_number,      personal_identity_number,    email,                                 created_at, updated_at, created_by, updated_by, comment                    ) VALUES
('Christopher ',          'Lo-Martire',           '+46712345678',    '19990703-9870',             'christopher.lomartire@example.com',   '2024-05-16 10:00:00',      NOW(),      1,          1,          'Sample comment 1'         ),
('Samuel',                'Siesjö',               '+46723019838',    '20010203-4567',             'samuel.siesjo@example.com',           '2024-05-18 10:00:01',      NOW(),      1,          1,          'Sample comment 2'         ),
('Jona',                  'Cwejman',              '555-111-2222',    '19720408-2288',             'jona.cqwejman@example.com',           '2024-05-17 10:00:00',      NOW(),      1,          1,          'Sample employee 3 comment'),
('Azfar',                 'Imtiaz',               '555-333-4444',    '20001224-7763',             'azfar.imtiaz@example.com',            '2024-05-19 10:00:00',      NOW(),      1,          1,          'Sample employee 4 comment');

--

INSERT INTO users
(username,       email,                     password, created_at, updated_at, created_by, updated_by                                                      ) VALUES
('christopher',  'admin@example.com',       '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-05-16 10:00:00', NOW(), 1, 2),
('user',         'user@example.com',        '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-07-17 10:00:00', NOW(), 1, 2),
('admin',        'admin2@example.com',      '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-10-18 10:00:00', NOW(), 1, 2);

--

INSERT INTO roles
(id, name       ) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER' ),
(3,'ROLE_PIPELINE');

--

INSERT INTO user_roles
(role_id, user_id) VALUES
(1,       1      ),
(2,       1      ),
(2,       2      ),
(1,       3      ),
(2,       3      );

--