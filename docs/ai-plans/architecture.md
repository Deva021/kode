# Bus Dispatcher System Architecture

## 1. Database Schema (Supabase/PostgreSQL)

### Tables

#### `routes`

Stores bus route definitions.

- `id`: `bigint` (Primary Key, Identity)
- `origin`: `text`
- `destination`: `text`
- `price`: `numeric(10, 2)`
- `created_at`: `timestamptz`

#### `schedules`

Specific trips for a route.

- `id`: `bigint` (Primary Key, Identity)
- `route_id`: `bigint` (Foreign Key -> `routes.id`)
- `departure_time`: `timestamptz`
- `bus_plate_number`: `text`
- `total_seats`: `integer`
- `booked_seats`: `integer` (Default: 0)
- `created_at`: `timestamptz`
- **Constraint**: `booked_seats <= total_seats`

#### `tickets`

Passenger bookings.

- `id`: `bigint` (Primary Key, Identity)
- `schedule_id`: `bigint` (Foreign Key -> `schedules.id`)
- `passenger_name`: `text`
- `seat_number`: `integer`
- `status`: `text` (Enum: 'booked', 'cancelled', 'reserved')
- `reservation_token`: `text` (Nullable, for lookup)
- `reservation_expires_at`: `timestamptz` (Nullable)
- `created_at`: `timestamptz`
- **Constraint**: Unique `(schedule_id, seat_number)`

#### `profiles`

Extended user data for Supabase Auth.

- `id`: `uuid` (Primary Key, FK -> `auth.users.id`)
- `email`: `text`
- `full_name`: `text`
- `role`: `text` (Default: 'agent')
- `created_at`: `timestamptz`

---

## 2. SQL Initialization Script

Run this in your Supabase SQL Editor.

```sql
-- 1. Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 2. Read-Only Policies (Public)
CREATE POLICY "Public routes are viewable by everyone" ON routes FOR SELECT USING (true);
CREATE POLICY "Public schedules are viewable by everyone" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public tickets are viewable by everyone" ON tickets FOR SELECT USING (true);

-- 3. Ticket Permissions
-- Everyone can create a reservation
CREATE POLICY "Everyone can create a reservation" ON tickets FOR INSERT WITH CHECK (true);

-- ONLY Agents can update tickets (e.g. Confirm Reservation)
CREATE POLICY "Agents can update tickets" ON tickets FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. AUTOMATION: Auto-update Seat Counts
CREATE OR REPLACE FUNCTION update_seat_count() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE schedules SET booked_seats = booked_seats + 1 WHERE id = NEW.schedule_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE schedules SET booked_seats = booked_seats - 1 WHERE id = OLD.schedule_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_seat_count_trigger ON tickets;
CREATE TRIGGER update_seat_count_trigger
AFTER INSERT OR DELETE ON tickets
FOR EACH ROW EXECUTE FUNCTION update_seat_count();

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;

-- 6. Profiles Table (for Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'agent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'agent');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 3. Next.js Folder Structure

Recommended structure for App Router (`/src`).

```
/src
├── app
│   ├── layout.tsx              # Root layout (Navbar, Providers)
│   ├── page.tsx                # Dashboard / Home
│   ├── routes
│   │   ├── page.tsx            # List all routes
│   │   ├── [id]
│   │   │   └── page.tsx        # View/Edit specific route
│   │   └── create
│   │       └── page.tsx        # Create new route
│   ├── schedules
│   │   ├── page.tsx            # List schedules (calendar/list view)
│   │   └── [id]
│   │       └── page.tsx        # Schedule details & seat map
│   └── tickets
│       └── page.tsx            # Search/Manage tickets
├── components
│   ├── ui                      # Generic UI (Button, Input, Card)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── features                # Domain components
│   │   ├── routes
│   │   │   ├── route-list.tsx
│   │   │   └── route-form.tsx
│   │   ├── schedules
│   │   │   ├── schedule-calendar.tsx
│   │   │   └── seat-picker.tsx
│   │   └── tickets
│   │       └── ticket-card.tsx
│   └── layout
│       └── sidebar.tsx
├── lib
│   ├── supabase.ts             # Supabase client creation
│   └── utils.ts                # Helper functions (cn, formatters)
├── hooks
│   ├── use-routes.ts           # SWR/TanStack Query hooks for routes
│   └── use-schedules.ts
├── types
│   ├── database.types.ts       # Generated from Supabase CLI
│   └── index.ts                # App-specific types
└── actions                     # Server Actions (mutations)
    ├── routes.ts               # createRoute, updateRoute
    ├── schedules.ts
    └── tickets.ts
```
