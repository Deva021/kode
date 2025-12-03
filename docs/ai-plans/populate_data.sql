-- Populate Database with Sample Data

-- 1. Insert 5 Major Ethiopian Routes
INSERT INTO public.routes (origin, destination, price) VALUES
('Addis Ababa', 'Hawassa', 350.00),
('Addis Ababa', 'Bahir Dar', 550.00),
('Addis Ababa', 'Gondar', 700.00),
('Addis Ababa', 'Mekelle', 900.00),
('Addis Ababa', 'Dire Dawa', 450.00);

-- 2. Insert 10 Schedules for this week (Assuming current date is around Dec 3, 2025)
-- We will dynamically fetch route_ids to ensure foreign key constraints are met.
-- Using a DO block to handle variables, or just simple INSERTs with subqueries.
-- Simple INSERTs with subqueries are more portable for the SQL Editor.

INSERT INTO public.schedules (route_id, departure_time, bus_plate_number, total_seats, booked_seats) VALUES
((SELECT id FROM public.routes WHERE destination = 'Hawassa' LIMIT 1), '2025-12-03 06:00:00+03', 'ET-12345', 40, 0),
((SELECT id FROM public.routes WHERE destination = 'Bahir Dar' LIMIT 1), '2025-12-03 07:00:00+03', 'ET-67890', 50, 0),
((SELECT id FROM public.routes WHERE destination = 'Gondar' LIMIT 1), '2025-12-04 06:30:00+03', 'ET-11223', 45, 0),
((SELECT id FROM public.routes WHERE destination = 'Mekelle' LIMIT 1), '2025-12-04 05:00:00+03', 'ET-44556', 50, 0),
((SELECT id FROM public.routes WHERE destination = 'Dire Dawa' LIMIT 1), '2025-12-05 08:00:00+03', 'ET-77889', 35, 0),
((SELECT id FROM public.routes WHERE destination = 'Hawassa' LIMIT 1), '2025-12-05 14:00:00+03', 'ET-99001', 40, 0),
((SELECT id FROM public.routes WHERE destination = 'Bahir Dar' LIMIT 1), '2025-12-06 07:00:00+03', 'ET-22334', 50, 0),
((SELECT id FROM public.routes WHERE destination = 'Gondar' LIMIT 1), '2025-12-06 06:30:00+03', 'ET-55667', 45, 0),
((SELECT id FROM public.routes WHERE destination = 'Mekelle' LIMIT 1), '2025-12-07 05:00:00+03', 'ET-88990', 50, 0),
((SELECT id FROM public.routes WHERE destination = 'Dire Dawa' LIMIT 1), '2025-12-07 08:00:00+03', 'ET-12121', 35, 0);

-- 3. Insert 20 Random Existing Bookings
-- We'll just pick some schedules and add tickets.
-- Note: In a real scenario, we should update booked_seats in schedules, but for this script we'll just insert tickets.
-- If there's a trigger, it might update booked_seats automatically. If not, we might want to update it manually.
-- For simplicity and as per request "populate ... bookings", we will just insert tickets.

INSERT INTO public.tickets (schedule_id, passenger_name, seat_number, status) VALUES
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-12345' LIMIT 1), 'Abebe Bikila', 1, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-12345' LIMIT 1), 'Kebede Michael', 2, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-67890' LIMIT 1), 'Almaz Ayana', 5, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-67890' LIMIT 1), 'Tirunesh Dibaba', 6, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-11223' LIMIT 1), 'Haile Gebrselassie', 10, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-11223' LIMIT 1), 'Kenenisa Bekele', 11, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-44556' LIMIT 1), 'Derartu Tulu', 3, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-44556' LIMIT 1), 'Fatuma Roba', 4, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-77889' LIMIT 1), 'Miruts Yifter', 1, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-77889' LIMIT 1), 'Meseret Defar', 2, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-99001' LIMIT 1), 'Genzebe Dibaba', 15, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-99001' LIMIT 1), 'Sileshi Sihine', 16, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-22334' LIMIT 1), 'Gezahegne Abera', 20, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-22334' LIMIT 1), 'Million Wolde', 21, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-55667' LIMIT 1), 'Berhane Adere', 8, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-55667' LIMIT 1), 'Gete Wami', 9, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-88990' LIMIT 1), 'Tiki Gelana', 12, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-88990' LIMIT 1), 'Mamo Wolde', 13, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-12121' LIMIT 1), 'Addis Gezahegn', 4, 'booked'),
((SELECT id FROM public.schedules WHERE bus_plate_number = 'ET-12121' LIMIT 1), 'Senbere Teferi', 5, 'booked');

-- Optional: Update booked_seats in schedules table to reflect the inserted tickets
UPDATE public.schedules s
SET booked_seats = (
    SELECT COUNT(*)
    FROM public.tickets t
    WHERE t.schedule_id = s.id
    AND t.status = 'booked'
);
