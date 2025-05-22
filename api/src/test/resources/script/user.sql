INSERT INTO users
(id, username,       email,                     password, created_at, updated_at, created_by, updated_by                                                      ) VALUES
(1, 'christopher',  'admin@example.com',       '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-05-16 10:00:00', NOW(), 1, 2),
(2, 'user',         'user@example.com',        '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-07-17 10:00:00', NOW(), 1, 2),
(3, 'admin',        'admin2@example.com',      '$2a$10$OV/brazFuYRnDqmaNKNereIvy8VK0RzZOw1ptctgw4fJLRCMckRfO', '2024-10-18 10:00:00', NOW(), 1, 2);

-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));