INSERT INTO bike (status, size, workshop_id, colour) VALUES (0, 26, 1, 'Red');
INSERT INTO bike (status, size, workshop_id, colour) VALUES (1, 24, 2, 'Blue');

INSERT INTO Workshop (address, phone_number, latitude, longitude, comment, created_at, updated_at, updated_by)
VALUES ('123 Main Street', '123-456-7890', 40.7128, -74.0060, 'Sample workshop 1 comment', NOW(), NOW(), 1),
       ('456 Elm Street', '987-654-3210', 34.0522, -118.2437, 'Sample workshop 2 comment', NOW(), NOW(), 1);

INSERT INTO Employee (name, last_name, phone_number, email, created_at, updated_at, updated_by, comment, workshop_id)
VALUES ('John', 'Doe', '123456789', 'john.doe@example.com', NOW(), NOW(), 1, 'Sample comment 1', 1),
       ('Jane', 'Smith', '987654321', 'jane.smith@example.com', NOW(), NOW(), 1, 'Sample comment 2', 1);

INSERT INTO Employee (name, last_name, phone_number, email, created_at, updated_at, updated_by, comment, workshop_id)
VALUES
    ('Alice', 'Johnson', '555-111-2222', 'alice.johnson@example.com', NOW(), NOW(), 1, 'Sample employee 3 comment', 2),
    ('Bob', 'Williams', '555-333-4444', 'bob.williams@example.com', NOW(), NOW(), 1, 'Sample employee 4 comment', 2);