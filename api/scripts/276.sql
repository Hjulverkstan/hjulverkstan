UPDATE ticket t
SET location_id = (
    SELECT v.location_id
    FROM ticket_vehicle tv
             JOIN vehicle v ON v.id = tv.vehicle_id
    WHERE tv.ticket_id = t.id
      AND v.location_id IS NOT NULL
    ORDER BY tv.vehicle_id ASC
    LIMIT 1
)
WHERE t.location_id IS NULL;

-- One-liner check: tickets missing location_id (should be 0 before prod)
SELECT COUNT(*) AS tickets_without_location FROM ticket WHERE location_id IS NULL;

create table notification
(
    id bigint primary key,
    created_at date,
    message varchar(255),
    notification_status varchar(255),
    notification_type   varchar(255),
    phone_number        varchar(255),
    sns_message_id      varchar(255),
    ticket_id           bigint
);