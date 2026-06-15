-- 012_gallery_storage.sql
-- Phase 4: Create Gallery Storage Bucket

-- 1. Create a new public bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery', 
  'gallery', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Create Storage Policies for the gallery bucket
-- Allow public access to view gallery images
CREATE POLICY "Public Access for Gallery Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery');

-- Allow authenticated admins to upload gallery images
CREATE POLICY "Admins can upload Gallery Images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'gallery' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated admins to update their uploads
CREATE POLICY "Admins can update Gallery Images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'gallery' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete Gallery Images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'gallery' 
        AND auth.role() = 'authenticated'
    );
