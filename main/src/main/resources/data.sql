-- SEED Table

INSERT INTO Location
(address,           name,      location_type, comment,                     created_at, updated_at, created_by, updated_by) VALUES
('123 Main Street', 'Hjällbo', 'SHOP',        'Sample location 1 comment', NOW(),      NOW(),      1,          1         ),
('456 Elm Street',  'Backa',   'SHOP',        'Sample location 2 comment', NOW(),      NOW(),      1,          1         );

--

INSERT INTO Employee
(employee_number, first_name,    last_name,  phone_number,   personal_identity_number, email,                       created_at, updated_at, created_by, updated_by, comment                    ) VALUES
('3',             'John',        'Doe',      '+46712345678', '9907039876',             'john.doe@example.com',      NOW(),      NOW(),      1,          1,          'Sample comment 1'         ),
('5',             'Jane',        'Smith',    '+46723019838', '0102034567',             'jane.smith@example.com',    NOW(),      NOW(),      1,          1,          'Sample comment 2'         ),
('6',             'Alice',       'Johnson',  '555-111-2222', '7204082288',             'alice.johnson@example.com', NOW(),      NOW(),      1,          1,          'Sample employee 3 comment'),
('7',             'Bob',         'Williams', '555-333-4444', '0012247766',             'bob.williams@example.com',  NOW(),      NOW(),      1,          1,          'Sample employee 4 comment');

--

INSERT INTO Customer
(customer_type,  first_name, last_name,  personal_identity_number, organization_name, phone_number,   email,                  created_at, updated_at, created_by, updated_by) VALUES
('PERSON',       'Tuva',     'Nilsson',  '1234567890',             null,             '+46798382301',  'tuva@example.com',     NOW(),      NOW(),      1,          1         ),
('PERSON',       'Emil',     'Berglund', '1234567890',             null,             '+46832103988',  'emil@example.com',     NOW(),      NOW(),      1,          1         ),
('ORGANIZATION', 'Bosse',    'Boström',  '7894561230',             'Biltema',        '+46798381201',  'bosseboss@biltema.se', NOW(),      NOW(),      1,          1         );

--

INSERT INTO vehicle
(location_id, vehicle_type, vehicle_status, imageurl,          comment,                        bike_type,  gear_count, size,     brake_type,     brand,         reg_tag,    vehicle_class, created_at, updated_at, created_by, updated_by) VALUES
(1,           'BIKE',       'AVAILABLE',    'image_url_1.jpg', null,                           'CHILD',    1,          'MEDIUM', 'DISC',         'SKEPPSHULT',  'HGJF',     'BIKE',        NOW(),      NOW(),      1,          1         ),
(1,           'BIKE',       'AVAILABLE',    'image_url_1.jpg', null,                           'ROAD',     12,         'MEDIUM', 'DISC',         'SKEPPSHULT',  'ERTY',     'BIKE',        NOW(),      NOW(),      1,          1         ),
(1,           'BIKE',       'BROKEN',       'image_url_1.jpg', 'Can not ever be repaired...',  'ROAD',     12,         'MEDIUM', 'DISC',         'SKEPPSHULT',  'VBNM',     'BIKE',        NOW(),      NOW(),      1,          1         ),
(2,           'BIKE',       'AVAILABLE',    'image_url_1.jpg', null,                           'BMX',      1,          'MEDIUM', 'DISC',         'KRONAN',      'DFGH',     'BIKE',        NOW(),      NOW(),      1,          1         ),
(2,           'BIKE',       'UNAVAILABLE',  'image_url_2.jpg', 'This bike weighs nothing!',    'ROAD',     18,         'LARGE',  'CALIPER',      'KRONAN',      'ANOJ',     'BIKE',        NOW(),      NOW(),      1,          1         ),
(2,           'BIKE',       'AVAILABLE',    'image_url_3.jpg', 'Bulletproof tires',            'ELECTRIC', 15,         'SMALL',  'DISC',         'KRONAN',      'QWER',     'BIKE',        NOW(),      NOW(),      1,          1         );

--

INSERT INTO Ticket
(ticket_type, is_open, employee_id, customer_id, start_date,            end_date,             comment,                  repair_description,                    created_at, updated_at, created_by, updated_by) VALUES
('RENT',      true,    1,           1,           '2024-03-06 10:00:00', '2024-08-06 18:00:00', 'I like this guy',       null,                                  NOW(),      NOW(),      1,          1         ),
('DONATE',    false,   1,           1,           '2024-03-06 08:00:00', '2024-03-06 12:00:00', null,                    null,                                  NOW(),      NOW(),      1,          1         ),
('REPAIR',    true,    3,           2,           '2024-03-06 13:00:00', '2024-03-06 15:00:00', 'Lets prioritise this',  'Flat tire front and loose handlebar', NOW(),      NOW(),      1,          1         ),
('REPAIR',    true,    3,           3,           '2024-03-06 13:00:00', '2024-06-06 15:00:00', null,                    'Pedals broken',                       NOW(),      NOW(),      1,          1         ),
('RENT',      false,   1,           1,           '2024-03-06 10:00:00', '2024-08-06 18:00:00', 'Could be back earlier', null,                                  NOW(),      NOW(),      1,          1         );

INSERT INTO Ticket_Vehicle
(vehicle_id, ticket_id) VALUES
(1,         1         ),
(2,         2         ),
(3,         2         ),
(4,         3         ),
(5,         4         ),
(6,         5         );

--

INSERT INTO General_Content
(text_type, name,                               description,                        key,                            created_at, updated_at, created_by, updated_by) VALUES
('PLAIN',   'Service: Fix Label',               'Service section, landing page',    'serviceFixLabel',              NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Fix Description',         'Service section, landing page',    'serviceFixDescription',        NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Courses Label',           'Service section, landing page',    'serviceCoursesLabel',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Courses Description',     'Service section, landing page',    'serviceCoursesDescription',    NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Bike Pool Label',         'Service section, landing page',    'serviceBikePoolLabel',         NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Bike Pool Description',   'Service section, landing page',    'serviceBikePoolDescription',   NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Safe Places Label',       'Service section, landing page',    'serviceSafePlacesLabel',       NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Safe Places Description', 'Service section, landing page',    'serviceSafePlacesDescription', NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Repaired',        'Statistics section, landing page', 'statisticBikesRepaired',       NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Saved',           'Statistics section, landing page', 'statisticBikesSaved',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Lent',            'Statistics section, landing page', 'statisticBikesLent',           NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Events Held',           'Statistics section, landing page', 'statisticEventsHeld',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Employees Hired',       'Statistics section, landing page', 'statisticEmployeesHired',      NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Slogan',                           'Slogan for landing page',          'slogan',                       NOW(),      NOW(),      1,          1         );

INSERT INTO Localised_Content
(general_content_id, lang,   field_name, content,                                                                                                                    created_at, updated_at, created_by, updated_by) VALUES
(1,                  'ENG',  'VALUE',    'Fix',                                                                                                                      NOW(),      NOW(),      1,          1),
(1,                  'SWE',  'VALUE',    'Fix',                                                                                                                      NOW(),      NOW(),      1,          1),
(2,                  'ENG',  'VALUE',    'We offer basic repairs for anything that rolls on wheels, such as bicycles, strollers, scooters and skateboards.',         NOW(),      NOW(),      1,          1),
(2,                  'SWE',  'VALUE',    'Vi erbjuder grundläggande reparationer för allt som rullar på hjul, såsom cyklar, barnvagnar, kickboards och skateboards', NOW(),      NOW(),      1,          1),
(3,                  'ENG',  'VALUE',    'Cycling Courses',                                                                                                          NOW(),      NOW(),      1,          1),
(3,                  'SWE',  'VALUE',    'Cykelkurser',                                                                                                              NOW(),      NOW(),      1,          1),
(4,                  'ENG',  'VALUE',    'Together with other organisations, we offer children and adults free cycling courses.',                                    NOW(),      NOW(),      1,          1),
(4,                  'SWE',  'VALUE',    'Tillsammans med andra organisationer erbjuder vi barn och vuxna kostnadsfria cykelkurser.',                                NOW(),      NOW(),      1,          1),
(5,                  'ENG',  'VALUE',    'Bicycle Pool',                                                                                                             NOW(),      NOW(),      1,          1),
(5,                  'SWE',  'VALUE',    'Cykelpool',                                                                                                                NOW(),      NOW(),      1,          1),
(6,                  'ENG',  'VALUE',    'A lending concept, where children and adults can borrow bicycles for a period of 1-2 weeks.',                              NOW(),      NOW(),      1,          1),
(6,                  'SWE',  'VALUE',    'Ett lånekoncept där både barn och vuxna kan låna cyklar gratis i upp till två veckor.',                                    NOW(),      NOW(),      1,          1),
(7,                  'ENG',  'VALUE',    'Safe Places',                                                                                                              NOW(),      NOW(),      1,          1),
(7,                  'SWE',  'VALUE',    'Trygga platser',                                                                                                           NOW(),      NOW(),      1,          1),
(8,                  'ENG',  'VALUE',    'We create safe places and a safe environment for people to meet, that are accessible to everyone.',                        NOW(),      NOW(),      1,          1),
(8,                  'SWE',  'VALUE',    'Vi skapar trygga platser och en säker miljö för människor att mötas, som är tillgängliga för alla.',                       NOW(),      NOW(),      1,          1),
(9,                  'ENG',  'VALUE',    'Bikes repaired',                                                                                                           NOW(),      NOW(),      1,          1),
(9,                  'SWE',  'VALUE',    'Reparerade cyklar',                                                                                                        NOW(),      NOW(),      1,          1),
(10,                 'ENG',  'VALUE',    'Bikes saved',                                                                                                              NOW(),      NOW(),      1,          1),
(10,                 'SWE',  'VALUE',    'Räddade cyklar',                                                                                                           NOW(),      NOW(),      1,          1),
(11,                 'ENG',  'VALUE',    'Bikes lent',                                                                                                               NOW(),      NOW(),      1,          1),
(11,                 'SWE',  'VALUE',    'Cyklar utlånade',                                                                                                          NOW(),      NOW(),      1,          1),
(12,                 'ENG',  'VALUE',    'Events held',                                                                                                              NOW(),      NOW(),      1,          1),
(12,                 'SWE',  'VALUE',    'Arrangerade evenemang',                                                                                                    NOW(),      NOW(),      1,          1),
(13,                 'ENG',  'VALUE',    'Employees hired',                                                                                                          NOW(),      NOW(),      1,          1),
(13,                 'SWE',  'VALUE',    'Personer anställda',                                                                                                       NOW(),      NOW(),      1,          1),
(14,                 'ENG',  'VALUE',    'A bike shop unlike any other',                                                                                             NOW(),      NOW(),      1,          1),
(14,                 'SWE',  'VALUE',    'En cykelbutik olik alla andra',                                                                                            NOW(),      NOW(),      1,          1);

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
