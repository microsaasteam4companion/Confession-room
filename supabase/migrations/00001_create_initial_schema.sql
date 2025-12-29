-- User role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Room status enum
CREATE TYPE room_status AS ENUM ('active', 'expired', 'deleted');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Profiles table (admin users only)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'user'::user_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Anonymous Room',
  max_participants INTEGER NOT NULL DEFAULT 10,
  initial_duration INTEGER NOT NULL DEFAULT 600, -- 10 minutes in seconds
  expires_at TIMESTAMPTZ NOT NULL,
  status room_status NOT NULL DEFAULT 'active'::room_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Room participants (anonymous users)
CREATE TABLE room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  avatar_name TEXT NOT NULL, -- e.g., "Ghost-42", "Ninja-15"
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages table (ephemeral)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES room_participants(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table for time extensions
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'inr',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_expires_at ON rooms(expires_at);
CREATE INDEX idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_orders_room_id ON orders(room_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Rooms policies (admins can manage, anyone can view active rooms)
CREATE POLICY "Anyone can view active rooms" ON rooms
  FOR SELECT USING (status = 'active'::room_status);

CREATE POLICY "Authenticated users can create rooms" ON rooms
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Creators can update their own rooms" ON rooms
  FOR UPDATE TO authenticated USING (creator_id = auth.uid());

CREATE POLICY "Admins can delete any room" ON rooms
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Room participants policies (public read for active rooms)
CREATE POLICY "Anyone can view participants in active rooms" ON room_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_participants.room_id AND r.status = 'active'::room_status
    )
  );

CREATE POLICY "Anyone can join rooms" ON room_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_participants.room_id AND r.status = 'active'::room_status
    )
  );

CREATE POLICY "Room creators can ban participants" ON room_participants
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_participants.room_id AND r.creator_id = auth.uid()
    )
  );

-- Messages policies (public read/write for active rooms)
CREATE POLICY "Anyone can view messages in active rooms" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = messages.room_id AND r.status = 'active'::room_status
    )
  );

CREATE POLICY "Participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = messages.room_id AND r.status = 'active'::room_status
    )
  );

-- Orders policies
CREATE POLICY "Anyone can view orders for their rooms" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Trigger to sync auth.users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (format: username@miaoda.com)
  INSERT INTO profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to extend room time
CREATE OR REPLACE FUNCTION extend_room_time(
  p_room_id UUID,
  p_minutes INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE rooms
  SET 
    expires_at = expires_at + (p_minutes || ' minutes')::INTERVAL,
    updated_at = NOW()
  WHERE id = p_room_id AND status = 'active'::room_status;
END;
$$;