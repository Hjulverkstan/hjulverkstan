INSERT INTO bike (status, size, workshop_id, colour) VALUES (0, 26, 1, 'Red');
INSERT INTO bike (status, size, workshop_id, colour) VALUES (1, 24, 2, 'Blue');

-- Inserting bikes
INSERT INTO bike (status, size, workshop_id, colour) VALUES (0, 26, 1, 'Red');
INSERT INTO bike (status, size, workshop_id, colour) VALUES (1, 24, 2, 'Blue');

-- Inserting workshops
INSERT INTO Workshop (address, phone_number, latitude, longitude, comment, created_at, updated_at, updated_by)
VALUES ('123 Main Street', '123-456-7890', 40.7128, -74.0060, 'Sample workshop 1 comment', NOW(), NOW(), 1),
       ('456 Elm Street', '987-654-3210', 34.0522, -118.2437, 'Sample workshop 2 comment', NOW(), NOW(), 1);

-- Inserting employees
INSERT INTO Employee (name, last_name, phone_number, email, created_at, updated_at, updated_by, comment, workshop_id)
VALUES ('John', 'Doe', '123456789', 'john.doe@example.com', NOW(), NOW(), 1, 'Sample comment 1', 1),
       ('Jane', 'Smith', '987654321', 'jane.smith@example.com', NOW(), NOW(), 1, 'Sample comment 2', 1),
       ('Alice', 'Johnson', '555-111-2222', 'alice.johnson@example.com', NOW(), NOW(), 1, 'Sample employee 3 comment', 2),
       ('Bob', 'Williams', '555-333-4444', 'bob.williams@example.com', NOW(), NOW(), 1, 'Sample employee 4 comment', 2);

-- Inserting customers
INSERT INTO Customer (name, last_name, phone_number, email, created_at, updated_at)
VALUES ('Customer1', 'Lastname1', '1234567890', 'customer1@example.com', NOW(), NOW()),
       ('Customer2', 'Lastname2', '9876543210', 'customer2@example.com', NOW(), NOW());

-- Inserting tickets without vehicles
--INSERT INTO Ticket (ticket_type, employee_id, customer_id, start_date, end_date, comment)
--VALUES
--    ('LOAN', 1, 1, '2024-03-06 10:00:00', '2024-03-06 18:00:00', 'Sample comment ticket 1'),
--    ('LOAN', 1, 2, '2024-03-06 08:00:00', '2024-03-06 12:00:00', 'Sample comment ticket 2'),
--    ('REPAIR', 3, 2, '2024-03-06 13:00:00', '2024-03-06 15:00:00', 'Sample comment ticket 3');

-- Inserting vehicles
INSERT INTO vehicle (vehicle_type, vehicle_status, imageurl, comment, bike_type, gear_count, size, brake_type)
VALUES
    ('BIKE', 'AVAILABLE', 'image_url_1.jpg', 'Comment about first bike', 'CHILD', 21, 'MEDIUM', 'DISC'),
    ('BIKE', 'UNAVAILABLE', 'image_url_2.jpg', 'Comment about second bike', 'ROAD', 18, 'LARGE', 'CALIPER'),
    ('BIKE', 'AVAILABLE', 'image_url_3.jpg', 'Comment about third bike', 'ELECTRIC', 15, 'SMALL', 'DISC');
