-- SEED Table

INSERT INTO Location
(address,           name,           location_type, comment,                    created_at,  updated_at, created_by, updated_by) VALUES
('123 Main Street', 'Hjulverkstan', 'SHOP',        'Sample location 1 comment', NOW(),      NOW(),      1,          1         ),
('456 Elm Street',  'Hjulverkstan', 'SHOP',        'Sample location 2 comment', NOW(),      NOW(),      1,          1         );

--

INSERT INTO Employee
(name,    last_name,  phone_number,   email,                       created_at, updated_at, created_by, updated_by, comment                    ) VALUES
('John',  'Doe',      '123456789',    'john.doe@example.com',      NOW(),      NOW(),      1,          1,          'Sample comment 1'         ),
('Jane',  'Smith',    '987654321',    'jane.smith@example.com',    NOW(),      NOW(),      1,          1,          'Sample comment 2'         ),
('Alice', 'Johnson',  '555-111-2222', 'alice.johnson@example.com', NOW(),      NOW(),      1,          1,          'Sample employee 3 comment'),
('Bob',   'Williams', '555-333-4444', 'bob.williams@example.com',  NOW(),      NOW(),      1,          1,          'Sample employee 4 comment');

--

INSERT INTO Customer
(customer_type,  first_name, last_name,  personal_identity_number, organization_name, phone_number, email,                  created_at, updated_at, created_by, updated_by) VALUES
('PERSON',       'Tuva',     'Nilsson',  '1234567890',             null,             '1234567890',  'tuva@example.com',     NOW(),      NOW(),      1,          1         ),
('PERSON',       'Emil',     'Berglund', '1234567890',             null,             '1234567890',  'emil@example.com',     NOW(),      NOW(),      1,          1         ),
('ORGANIZATION', 'Bosse',    'Boström',  '7894561230',             'Biltema',        '9876543210',  'bosseboss@biltema.se', NOW(),      NOW(),      1,          1         );

--

INSERT INTO vehicle
(vehicle_type, vehicle_status, imageurl,          comment,                        bike_type,  gear_count, size,     brake_type, created_at, updated_at, created_by, updated_by) VALUES
('BIKE',        'AVAILABLE',    'image_url_1.jpg',  null,                          'CHILD',    0,          'MEDIUM', 'DISC',     NOW(),      NOW(),      1,          1         ),
('BIKE',        'AVAILABLE',    'image_url_1.jpg',  null,                          'ROAD',     12,         'MEDIUM', 'DISC',     NOW(),      NOW(),      1,          1         ),
('BIKE',        'BROKEN',       'image_url_1.jpg',  'Can not ever be repaired...', 'ROAD',     12,         'MEDIUM', 'DISC',     NOW(),      NOW(),      1,          1         ),
('BIKE',        'AVAILABLE',    'image_url_1.jpg',  null,                          'BMX',      0,          'MEDIUM', 'DISC',     NOW(),      NOW(),      1,          1         ),
('BIKE',        'UNAVAILABLE',  'image_url_2.jpg', 'This bike weighs nothing!',    'ROAD',     18,         'LARGE',  'CALIPER',  NOW(),      NOW(),      1,          1         ),
('BIKE',        'AVAILABLE',    'image_url_3.jpg', 'Bulletproof tires',            'ELECTRIC', 15,         'SMALL',  'DISC',     NOW(),      NOW(),      1,          1         );

--

INSERT INTO Ticket
(ticket_type, is_open, employee_id, customer_id, start_date,            end_date,             comment,                    created_at, updated_at, created_by, updated_by) VALUES
('RENT',      true,    1,           1,           '2024-03-06 10:00:00', '2024-08-06 18:00:00', 'I like this guy',         NOW(),      NOW(),      1,          1         ),
('DONATE',    false,   1,           1,           '2024-03-06 08:00:00', '2024-03-06 12:00:00', null,                      NOW(),      NOW(),      1,          1         ),
('REPAIR',    true,    3,           2,           '2024-03-06 13:00:00', '2024-03-06 15:00:00', 'Sample comment ticket 3', NOW(),      NOW(),      1,          1         ),
('RENT',      false,   1,           1,           '2024-03-06 10:00:00', '2024-08-06 18:00:00', 'I like this guy',         NOW(),      NOW(),      1,          1         );

INSERT INTO Ticket_Vehicle
(vehicle_id, ticket_id) VALUES
(1,         1         ),
(2,         4         ),
(4,         3         );


--

INSERT INTO users
(id, username, email,               password                                                      ) VALUES           
(1,  'admin',  'admin@example.com', '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO'),
(2,  'user',   'user@example.com',  '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO');

INSERT INTO roles
(id, name       ) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER' );

INSERT INTO user_roles
(role_id, user_id) VALUES
(1,       1      ),
(2,       1      ),
(2,       2      );
