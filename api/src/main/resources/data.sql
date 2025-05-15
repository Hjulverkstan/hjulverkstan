-- SEED Table

INSERT INTO Location
(address,           name,          location_type, comment,                     created_at,          updated_at, created_by, updated_by) VALUES
('123 Main Street', 'Hjällbo',     'SHOP',        'Sample location 1 comment', '2024-05-16 10:00:00', NOW(),      1,          1         ),
('456 Elm Street',  'Backa',       'SHOP',        'Sample location 2 comment', '2024-05-17 10:00:00', NOW(),      1,          1         ),
('789 Oak Avenue',  'Gamlestaden', 'SHOP',        'Sample location 3 comment', '2024-05-18 10:00:00', NOW(),      1,          1         ),
('101 Pine Road',   'Majorna',     'SHOP',        'Sample location 4 comment', '2024-05-19 10:00:00', NOW(),      1,          1         ),
('202 Birch Lane',  'Gamlestaden', 'SHOP',       'Sample location 5 comment', '2024-05-20 10:00:00', NOW(),      1,          1         ),
('303 Cedar Street', 'Majorna',    'SHOP',        'Sample location 6 comment', '2024-05-21 10:00:00', NOW(),      1,          1         );

--

INSERT INTO Employee
(first_name,              last_name,              phone_number,      personal_identity_number,    email,                                 created_at, updated_at, created_by, updated_by, comment                    ) VALUES
('Christopher ',          'Lo-Martire',           '+46712345678',    '19990703-9870',             'christopher.lomartire@example.com',   '2024-05-16 10:00:00',      NOW(),      1,          1,          'Sample comment 1'         ),
('Samuel',                'Siesjö',               '+46723019838',    '20010203-4567',             'samuel.siesjo@example.com',           '2024-05-18 10:00:01',      NOW(),      1,          1,          'Sample comment 2'         ),
('Jona',                  'Cwejman',              '555-111-2222',    '19720408-2288',             'jona.cqwejman@example.com',           '2024-05-17 10:00:00',      NOW(),      1,          1,          'Sample employee 3 comment'),
('Azfar',                 'Imtiaz',               '555-333-4444',    '20001224-7763',             'azfar.imtiaz@example.com',            '2024-05-19 10:00:00',      NOW(),      1,          1,          'Sample employee 4 comment');
--

INSERT INTO Customer
(customer_type,  first_name, last_name,  personal_identity_number,    organization_name,phone_number,    email,                  created_at, updated_at, created_by, updated_by) VALUES
('PERSON',       'Tuva',     'Nilsson',  '19900101-1237',             null,             '+46798382301',  'tuva@example.com',     '2024-05-16 10:00:00',      NOW(),      1,          1         ),
('PERSON',       'Emil',     'Berglund', '19851224-5672',             null,             '+46832103988',  'emil@example.com',     '2024-05-17 10:00:00',      NOW(),      1,          1         ),
('ORGANIZATION', 'Bosse',    'Boström',  '20030515-9018',             'Biltema',        '+46798381201',  'bosseboss@biltema.se', '2024-05-18 10:00:00',      NOW(),      1,          1         );

--

INSERT INTO vehicle
(location_id, vehicle_type, vehicle_status,   imageURL,            comment,                       is_customer_owned, bike_type,      gear_count, size,     brake_type,     brand,         reg_tag,    vehicle_class,   created_at,            updated_at, created_by, updated_by) VALUES
(1,           'BIKE',       'UNAVAILABLE',    'image_url_1.jpg',   null,                          true,              'CHILD',        1,          'MEDIUM', 'DISC',         'SKEPPSHULT',  null,       'BIKE',          '2024-05-16 10:00:00', NOW(),      1,          1         ),
(1,           'BIKE',       'UNAVAILABLE',    'image_url_1.jpg',   null,                          false,             'ROAD',         12,         'MEDIUM', 'DISC',         'SKEPPSHULT',  'ERTY',     'BIKE',          '2024-05-17 10:00:00', NOW(),      1,          1         ),
(1,           'BIKE',       'UNAVAILABLE',    'image_url_1.jpg',   null,                          false,             'LADY',         15,         'MEDIUM', 'FOOTBRAKE',    'MONARK',      'YTLO',     'BIKE',          '2024-05-18 10:00:00', NOW(),      1,          1         ),
(1,           'BIKE',       'BROKEN',         'image_url_1.jpg',   'Can not ever be repaired...', true,              'ROAD',         12,         'MEDIUM', 'DISC',         'SKEPPSHULT',  null,       'BIKE',          '2024-05-19 10:00:00', NOW(),      1,          1         ),
(2,           'BIKE',       'UNAVAILABLE',    'image_url_1.jpg',   null,                          true,              'BMX',          1,          'MEDIUM', 'DISC',         'KRONAN',      null,       'BIKE',          '2024-05-20 10:00:00', NOW(),      1,          1         ),
(2,           'BIKE',       'AVAILABLE',      'image_url_2.jpg',   'This bike weighs nothing!',   false,             'ROAD',         18,         'LARGE',  'CALIPER',      'KRONAN',      'ANOJ',     'BIKE',          '2024-05-21 10:00:00', NOW(),      1,          1         ),
(2,           'BIKE',       'AVAILABLE',      'image_url_3.jpg',   'Bulletproof tires',           false,             'ELECTRIC',     15,         'SMALL',  'DISC',         'KRONAN',      'QWER',     'BIKE',          '2024-05-21 10:00:00', NOW(),      1,          1         ),
(1,           'BIKE',       null,             'image_url_2.jpg',   null,                          true,              'MOUNTAINBIKE', 28,         'LARGE',  'CALIPER',      'PELAGO',      null,       'BIKE',          '2024-06-21 10:00:00', NOW(),      1,          1         );

--

INSERT INTO Ticket
(ticket_type, ticket_status,    employee_id,  customer_id,     start_date,                end_date,                   comment,                     repair_description,                           created_at,    updated_at,    created_by,   updated_by)  VALUES
('REPAIR',    'CLOSED',         2,            1,               '2024-03-06 10:00:00',     '2024-03-12 18:00:00',      'Important',                 'Adjust gears and lubricate',                 '2024-05-16 10:00:00',         NOW(),         1,            1         ),
('RENT',      'CLOSED',         1,            2,               '2024-03-15 10:00:00',     '2024-04-02 18:00:00',      null                   ,     null,                                         '2024-05-17 10:00:00',         NOW(),         1,            1         ),
('REPAIR',    'CLOSED',         2,            1,               '2024-04-01 10:00:00',     '2024-04-06 18:00:00',      'Could be back earlier',     'Flat tire front and loose handlebar',        '2024-05-16 10:00:01',         NOW(),         1,            1         ),
('RENT',      'IN_PROGRESS',    3,            1,               '2024-05-10 13:00:00',     '2024-05-28 15:00:00',      null,                        null,                                         '2024-05-16 10:00:02',         NOW(),         1,            1         ),
('RENT',      'IN_PROGRESS',    3,            2,               '2024-05-01 13:00:00',     '2024-05-14 15:00:00',      'Lets prioritise this',      null,                                         '2024-05-16 10:00:03',         NOW(),         1,            1         ),
('DONATE',    null,             1,            3,               null,                      null,                       null,                        null,                                         '2024-05-16 10:00:08',         NOW(),         1,            1         ),
('RENT',      'IN_PROGRESS',    1,            1,               '2024-05-16 10:00:00',     '2024-06-16 18:00:00',      'I like this guy',           null,                                         '2024-05-16 10:00:09',         NOW(),         1,            1         ),
('RECEIVE',   null,             2,            3,               null,                      null,                       null,                        null,                                         NOW(),         NOW(),         1,            1         );

INSERT INTO Ticket_Vehicle
(vehicle_id, ticket_id) VALUES
(1,         1         ),
(3,         2         ),
(4,         2         ),
(2,         3         ),
(5,         4         ),
(6,         5         ),
(7,         6         ),
(7,         7         ),
(8,         8         );

--

INSERT INTO General_Content
(text_type, name,                               description,                        key,                            created_at, updated_at, created_by, updated_by) VALUES
('PLAIN',   'Service: Repair Label',            'Service section, landing page',    'serviceRepairTitle',              NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Repair Description',      'Service section, landing page',    'serviceRepairBody',        NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Courses Label',           'Service section, landing page',    'serviceCoursesTitle',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Courses Description',     'Service section, landing page',    'serviceCoursesBody',    NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Rent Label',              'Service section, landing page',    'serviceRentTitle',         NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Rent Description',        'Service section, landing page',    'serviceRentBody',   NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Community Label',         'Service section, landing page',    'serviceCommunityTitle',       NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Service: Community Description',   'Service section, landing page',    'serviceCommunityBody', NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Repaired',        'Statistics section, landing page', 'statisticBikesRepaired',       NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Saved',           'Statistics section, landing page', 'statisticBikesSaved',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Bikes Lent',            'Statistics section, landing page', 'statisticBikesLent',           NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Events Held',           'Statistics section, landing page', 'statisticEventsHeld',          NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Statistic: Employees Hired',       'Statistics section, landing page', 'statisticEmployeesHired',      NOW(),      NOW(),      1,          1         ),
('PLAIN',   'Slogan',                           'Slogan for landing page',          'slogan',                       NOW(),      NOW(),      1,          1         );

INSERT INTO Open_Hours
(mon,               tue,               wed,               thu,               fri,               sat,               sun) VALUES
(null,              '10:00 - 18:00',   null,              '14:00 - 18:00',   null,              null,              null),
('10:00 - 18:00',   null,              '10:00 - 18:00',   null,              null,              null,              null),
('15:00 - 18:00',   '10:00 - 18:00',   '10:00 - 18:00',   '15:00 - 18:00',   null,              null,              null),
('15:00 - 18:00',   '15:00 - 18:00',   '15:00 - 18:00',   '14:00 - 18:00',   null,              null,              null),
('15:00 - 18:00',   '10:00 - 18:00',   '10:00 - 18:00',   '15:00 - 18:00',   null,              null,              null),
('15:00 - 18:00',   '15:00 - 18:00',   '15:00 - 18:00',   '15:00 - 18:00',   null,              null,              null);


INSERT INTO Shop
(name,                    address,                                         latitude,  longitude, imageURL,                                                                                    open_hours_id, has_temporary_hours, location_id, slug,           created_at, updated_at, created_by, updated_by) VALUES
('Hjällbo',               'Skolspåret 15, 424 37 Angered',                 57.769667, 12.013639, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/4414679a-3c1b-4722-bd10-f95e66723a97.jpg', 1,             false,               1,           'hjallbo',      NOW(),      NOW(),      1,          1         ),
('Backa',                 'Selma Lagerlöfs Torg 20, 422 48 Hisings Backa', 57.748000, 11.965000, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/d80043e0-2c01-4511-a6e4-f0980da04da5.jpg', 2,             false,               2,           'backa',        NOW(),      NOW(),      1,          1         ),
('Gamlestaden',           'Lars Kaggsgatan 40D, 415 04 Göteborg',          57.720700, 12.010000, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/029c60ac-e93e-4501-98e8-8c41d72d2b75.jpg', 3,             false,               3,           'gamlestaden',  NOW(),      NOW(),      1,          1         ),
('Majorna',               'Skärgårdsgatan 4, 414 58 Göteborg',             57.694000, 11.925000, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/d80043e0-2c01-4511-a6e4-f0980da04da5.jpg', 4,             false,               4,           'majorna',      NOW(),      NOW(),      1,          1         ),
('Gamlestaden',           'Lars Kaggsgatan 40D, 415 04 Göteborg',          57.720700, 12.010000, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/029c60ac-e93e-4501-98e8-8c41d72d2b75.jpg', 5,             false,               5,           'gamlestaden2', NOW(),      NOW(),      1,          1         ),
('Majorna',               'Skärgårdsgatan 4, 414 58 Göteborg',             57.694000, 11.925000, 'https://hjulverkstan.s3.eu-north-1.amazonaws.com/d80043e0-2c01-4511-a6e4-f0980da04da5.jpg', 6,             false,               6,           'majorna2',     NOW(),      NOW(),      1,          1         );

INSERT INTO Localised_Content
(lang,   field_name,     content,                                                                                                                                                               created_at, updated_at, created_by, updated_by, general_content_id, shop_id) VALUES
('ENG',  'VALUE',        'Get a repair',                                                                                                                                                        NOW(),      NOW(),      1,          1,          1,                  null),
('SWE',  'VALUE',        'Lämna in på reparation',                                                                                                                                              NOW(),      NOW(),      1,          1,          1,                  null),
('ENG',  'VALUE',        'We offer repairs free of charge for bicycles, strollers, scooters and more.',                                                                                         NOW(),      NOW(),      1,          1,          2,                  null),
('SWE',  'VALUE',        'Vi erbjuder reparationer kostnadsfritt för cyklar, barnvagnar, sparkcyklar m.m',                                                                                      NOW(),      NOW(),      1,          1,          2,                  null),
('ENG',  'VALUE',        'Learn to ride',                                                                                                                                                       NOW(),      NOW(),      1,          1,          3,                  null),
('SWE',  'VALUE',        'Lär dig cykla',                                                                                                                                                       NOW(),      NOW(),      1,          1,          3,                  null),
('ENG',  'VALUE',        'Join one of our children or adults free cycling courses.',                                                                                                            NOW(),      NOW(),      1,          1,          4,                  null),
('SWE',  'VALUE',        'Delta i en av våra kostnadsfria barn eller vuxen -cykelkurser',                                                                                                       NOW(),      NOW(),      1,          1,          4,                  null),
('ENG',  'VALUE',        'Rent a bike',                                                                                                                                                         NOW(),      NOW(),      1,          1,          5,                  null),
('SWE',  'VALUE',        'Hyr en cykel',                                                                                                                                                        NOW(),      NOW(),      1,          1,          5,                  null),
('ENG',  'VALUE',        'Children and adults can borrow bicycles, or other vehicles, for a period of 1-2 weeks.',                                                                              NOW(),      NOW(),      1,          1,          6,                  null),
('SWE',  'VALUE',        'Både barn och vuxna kan låna cyklar, eller andra fordon, gratis i upp till två veckor.',                                                                              NOW(),      NOW(),      1,          1,          6,                  null),
('ENG',  'VALUE',        'Join a community',                                                                                                                                                    NOW(),      NOW(),      1,          1,          7,                  null),
('SWE',  'VALUE',        'Gå med i en gemenskap',                                                                                                                                               NOW(),      NOW(),      1,          1,          7,                  null),
('ENG',  'VALUE',        'We create a safe environment for people to meet, accessible to everyone.',                                                                                            NOW(),      NOW(),      1,          1,          8,                  null),
('SWE',  'VALUE',        'Vi skapar en trygg miljö för människor att mötas i, tillgänglig för alla.',                                                                                           NOW(),      NOW(),      1,          1,          8,                  null),
('ENG',  'VALUE',        'Bikes repaired',                                                                                                                                                      NOW(),      NOW(),      1,          1,          9,                  null),
('SWE',  'VALUE',        'Reparerade cyklar',                                                                                                                                                   NOW(),      NOW(),      1,          1,          9,                  null),
('ENG',  'VALUE',        'Bikes saved',                                                                                                                                                         NOW(),      NOW(),      1,          1,          10,                 null),
('SWE',  'VALUE',        'Räddade cyklar',                                                                                                                                                      NOW(),      NOW(),      1,          1,          10,                 null),
('ENG',  'VALUE',        'Bikes lent',                                                                                                                                                          NOW(),      NOW(),      1,          1,          11,                 null),
('SWE',  'VALUE',        'Cyklar utlånade',                                                                                                                                                     NOW(),      NOW(),      1,          1,          11,                 null),
('ENG',  'VALUE',        'Events held',                                                                                                                                                         NOW(),      NOW(),      1,          1,          12,                 null),
('SWE',  'VALUE',        'Arrangerade evenemang',                                                                                                                                               NOW(),      NOW(),      1,          1,          12,                 null),
('ENG',  'VALUE',        'Employees hired',                                                                                                                                                     NOW(),      NOW(),      1,          1,          13,                 null),
('SWE',  'VALUE',        'Personer anställda',                                                                                                                                                  NOW(),      NOW(),      1,          1,          13,                 null),
('ENG',  'VALUE',        'A bike shop unlike any other',                                                                                                                                        NOW(),      NOW(),      1,          1,          14,                 null),
('SWE',  'VALUE',        'En cykelbutik olik alla andra',                                                                                                                                       NOW(),      NOW(),      1,          1,          14,                 null),
('ENG',  'BODY_TEXT',    'At Skolspåret 15, we offer basic servicing of your bike, such as fixing pedals, adjusting gears, checking tires, air pressure, and lubrication, among other things.', NOW(),      NOW(),      1,          1,          null,               1),
('SWE',  'BODY_TEXT',    'På Skolspåret 15 erbjuder vi enkla reparationer på din cykel, så som att laga pedalerna, justera växlarna, kolla hjulen, lufttrycket och insmörjning.',               NOW(),      NOW(),      1,          1,          null,               1);

--

INSERT INTO users
(username,       email,                     password, created_at, updated_at, created_by, updated_by                                                      ) VALUES
('christopher',  'admin@example.com',       '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-05-16 10:00:00', NOW(), 1, 2),
('user',         'user@example.com',        '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-07-17 10:00:00', NOW(), 1, 2),
('admin',        'admin2@example.com',      '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-10-18 10:00:00', NOW(), 1, 2);

INSERT INTO roles
(id, name       ) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER' ),
(3,'ROLE_PIPELINE');

INSERT INTO user_roles
(role_id, user_id) VALUES
(1,       1      ),
(2,       1      ),
(2,       2      ),
(1,       3      ),
(2,       3      );
