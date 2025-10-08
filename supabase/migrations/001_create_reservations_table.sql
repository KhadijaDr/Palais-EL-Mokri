-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  room_type VARCHAR(100) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount DECIMAL(10,2),
  team_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_email for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_user_email ON reservations(user_email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see their own reservations
CREATE POLICY "Users can view their own reservations" ON reservations
    FOR SELECT USING (true); -- For now, allow all reads - you can restrict this later

-- Create policy to allow inserting new reservations
CREATE POLICY "Anyone can create reservations" ON reservations
    FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own reservations
CREATE POLICY "Users can update their own reservations" ON reservations
    FOR UPDATE USING (true); -- For now, allow all updates - you can restrict this later