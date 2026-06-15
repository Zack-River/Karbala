-- 011_gallery_images.sql
-- Phase 4: Image Gallery

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Public can view all gallery images
CREATE POLICY "Public can view gallery images"
    ON public.gallery_images FOR SELECT
    USING (true);

-- 2. Only authenticated admins can insert/update/delete
CREATE POLICY "Admins can insert gallery images"
    ON public.gallery_images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update gallery images"
    ON public.gallery_images FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete gallery images"
    ON public.gallery_images FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create an index for faster sorting
CREATE INDEX IF NOT EXISTS idx_gallery_images_sort_order ON public.gallery_images(sort_order);
