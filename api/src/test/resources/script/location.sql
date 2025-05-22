INSERT INTO Location
(id, address, name, location_type, comment, created_at, updated_at, created_by, updated_by) VALUES
(1, '123 Main Street', 'Hjällbo', 'SHOP', 'Sample location 1 comment', '2024-05-16 10:00:00', NOW(), 1, 1 ),
(2, '456 Elm Street', 'Backa', 'SHOP', 'Sample location 2 comment', '2024-05-17 10:00:00', NOW(), 1, 1 ),
(3, '54545 Elm Street', 'Nacka', 'SHOP', 'Sample location 3 comment', '2024-05-18 10:00:00', NOW(), 1, 1 );

-- SELECT setval('location_id_seq', (SELECT MAX(id) FROM location));
