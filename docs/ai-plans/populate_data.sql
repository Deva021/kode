-- ==========================================
-- POPULATE DATABASE SCRIPT
-- ==========================================

-- 1. Insert 8 Major Ethiopian Routes
INSERT INTO routes (origin, destination, price) VALUES
('Addis Ababa', 'Bahir Dar', 850.00),
('Addis Ababa', 'Gondar', 1100.00),
('Addis Ababa', 'Hawassa', 450.00),
('Addis Ababa', 'Mekelle', 1300.00),
('Addis Ababa', 'Dire Dawa', 600.00),
('Addis Ababa', 'Jimma', 550.00),
('Addis Ababa', 'Adama', 200.00),
('Addis Ababa', 'Arba Minch', 700.00);

-- 2. Insert 40 Schedules for the Next 7 Days
-- We use a CTE (Common Table Expression) to generate random schedules linked to the routes above
INSERT INTO schedules (route_id, departure_time, bus_plate_number, total_seats, booked_seats)
SELECT 
  r.id,
  (NOW() + (floor(random() * 7) || ' days')::interval + (floor(random() * 10 + 6) || ' hours')::interval)::timestamptz, -- Random time between 6 AM and 4 PM next 7 days
  'ET-' || floor(random() * 90000 + 10000)::text, -- Random Plate Number
  50, -- Total Seats
  0   -- Initial booked seats (will be updated by trigger or manual update)
FROM routes r
CROSS JOIN generate_series(1, 5); -- Generate 5 schedules per route (8 * 5 = 40 schedules)

-- 3. Insert 60 Random Bookings
-- We randomly assign passengers to the newly created schedules
INSERT INTO tickets (schedule_id, passenger_name, seat_number, status, reservation_token, reservation_expires_at)
SELECT 
  s.id,
  'Passenger ' || floor(random() * 1000)::text,
  floor(random() * 50 + 1)::int, -- Random Seat 1-50
  CASE WHEN random() < 0.8 THEN 'booked' ELSE 'reserved' END, -- 80% booked, 20% reserved
  substring(md5(random()::text) from 1 for 6), -- Random Token
  NOW() + interval '1 day'
FROM schedules s
ORDER BY random()
LIMIT 60;

-- 4. Sync Booked Seats Count
-- Just in case the trigger didn't fire for bulk inserts or to be 100% sure
UPDATE schedules s
SET booked_seats = (
  SELECT COUNT(*) 
  FROM tickets t 
  WHERE t.schedule_id = s.id AND t.status IN ('booked', 'reserved')
);

-- 5. Create 2 Test Agents
-- WARNING: This inserts directly into auth.users. This usually works if pgcrypto is enabled.
-- Passwords will be 'password123'

-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  agent1_id UUID := gen_random_uuid();
  agent2_id UUID := gen_random_uuid();
BEGIN
  -- Agent 1: agent1@example.com
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    agent1_id,
    'agent1@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Test Agent 1"}'::jsonb
  );

  -- Profile for Agent 1 (Trigger might handle this, but we ensure role is 'agent')
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (agent1_id, 'agent1@example.com', 'Test Agent 1', 'agent')
  ON CONFLICT (id) DO UPDATE SET role = 'agent';

  -- Agent 2: agent2@example.com
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    agent2_id,
    'agent2@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "Test Agent 2"}'::jsonb
  );

  -- Profile for Agent 2
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (agent2_id, 'agent2@example.com', 'Test Agent 2', 'agent')
  ON CONFLICT (id) DO UPDATE SET role = 'agent';

END $$;
