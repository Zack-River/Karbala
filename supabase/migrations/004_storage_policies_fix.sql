-- =========================================
-- Storage RLS Fix
-- Ensures admin uploads work via authenticated session AND service role
-- =========================================

-- Ensure media bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old restrictive policies if they exist (idempotent re-run)
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access to media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users full access to media" ON storage.objects;

-- Public read
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Authenticated admin: full CRUD on media bucket
CREATE POLICY "Authenticated users full access to media" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- Service role: full access (server actions fallback)
CREATE POLICY "Service role full access to media" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');
