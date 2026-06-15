-- 010_visitor_analytics.sql
-- Phase 3: Visitor Analytics

-- Create page_views table
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Public can insert page views (since visitors are mostly unauthenticated)
CREATE POLICY "Public can insert page views"
    ON public.page_views FOR INSERT
    WITH CHECK (true);

-- 2. Only authenticated admins can read page views
CREATE POLICY "Admins can view page views"
    ON public.page_views FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
