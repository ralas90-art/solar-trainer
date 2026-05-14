-- Enable Row Level Security (RLS) on tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.userstats ENABLE ROW LEVEL SECURITY;

-- Create policies to DENY access to public/anon (Frontend)
-- Since your app uses a Python Backend (Service Role/Admin), it will bypass RLS.
-- These policies prevent anyone with just the Public API Key from accessing data.

-- Policy for 'user' table
CREATE POLICY "No Public Access" 
ON public.user
FOR ALL 
TO public, anon 
USING (false);

-- Policy for 'userstats' table
CREATE POLICY "No Public Access to Stats" 
ON public.userstats
FOR ALL 
TO public, anon 
USING (false);

-- Optional: If you eventually want the Frontend to read Leaderboards directly:
-- CREATE POLICY "Enable Read Access for Leaderboard"
-- ON public.userstats
-- FOR SELECT
-- TO anon
-- USING (true);
