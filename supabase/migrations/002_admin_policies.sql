-- =========================================
-- Admin RLS Policies: وعي يمر من كربلاء
-- Run this in Supabase SQL Editor AFTER setting up the project
-- This allows authenticated admin users to perform CRUD operations
-- =========================================

-- Admin write policies for all tables
-- These allow authenticated users to INSERT, UPDATE, and DELETE

-- Seasons
CREATE POLICY "Authenticated users can manage seasons" ON seasons
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Nights
CREATE POLICY "Authenticated users can manage nights" ON nights
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Also allow authenticated users to read all nights (including drafts)
CREATE POLICY "Authenticated users can view all nights" ON nights
  FOR SELECT USING (auth.role() = 'authenticated');

-- Topics
CREATE POLICY "Authenticated users can manage topics" ON topics
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verses
CREATE POLICY "Authenticated users can manage verses" ON verses
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Narrations
CREATE POLICY "Authenticated users can manage narrations" ON narrations
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Resources
CREATE POLICY "Authenticated users can manage resources" ON resources
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Cards
CREATE POLICY "Authenticated users can manage cards" ON cards
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Attachments
CREATE POLICY "Authenticated users can manage attachments" ON attachments
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Storage Bucket Setup ───
-- Create the media bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND auth.role() = 'authenticated'
  );

-- Allow public read access to media bucket
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
