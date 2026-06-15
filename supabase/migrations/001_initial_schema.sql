-- =========================================
-- Database Schema: وعي يمر من كربلاء
-- Educational Islamic Content Platform
-- =========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enum Types ───

CREATE TYPE night_status AS ENUM ('draft', 'published', 'hidden');
CREATE TYPE card_type AS ENUM ('quote', 'reflection', 'visual');
CREATE TYPE card_status AS ENUM ('draft', 'published');
CREATE TYPE attachment_type AS ENUM ('audio', 'pdf', 'image');
CREATE TYPE attachment_status AS ENUM ('draft', 'published');
CREATE TYPE resource_category AS ENUM ('book', 'article', 'video', 'website');

-- ─── Seasons ───

CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  intro TEXT,
  hero_image TEXT,
  logo_image TEXT,
  is_active BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Nights ───

CREATE TABLE nights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  teaser TEXT,
  why_important TEXT,
  central_idea TEXT,
  quote TEXT,
  quote_author TEXT,
  reflection_question TEXT,
  practical_step TEXT,
  cover_image TEXT,
  audio_file TEXT,
  pdf_file TEXT,
  status night_status DEFAULT 'draft',
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Topics ───

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Verses (Quran) ───

CREATE TABLE verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  surah_name TEXT,
  verse_number TEXT,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Narrations (Hadith) ───

CREATE TABLE narrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Resources ───

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category resource_category DEFAULT 'article',
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Cards ───

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID REFERENCES nights(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  type card_type DEFAULT 'quote',
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  downloadable BOOLEAN DEFAULT false,
  status card_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Attachments ───

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type attachment_type DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  downloadable BOOLEAN DEFAULT true,
  status attachment_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───

CREATE INDEX idx_nights_slug ON nights(slug);
CREATE INDEX idx_nights_season ON nights(season_id);
CREATE INDEX idx_nights_status ON nights(status);
CREATE INDEX idx_nights_sort ON nights(sort_order);
CREATE INDEX idx_cards_slug ON cards(slug);
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_night ON cards(night_id);
CREATE INDEX idx_topics_night ON topics(night_id);
CREATE INDEX idx_verses_night ON verses(night_id);
CREATE INDEX idx_narrations_night ON narrations(night_id);
CREATE INDEX idx_resources_night ON resources(night_id);
CREATE INDEX idx_attachments_night ON attachments(night_id);

-- ─── Updated At Trigger ───

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_nights_updated_at BEFORE UPDATE ON nights FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_verses_updated_at BEFORE UPDATE ON verses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_narrations_updated_at BEFORE UPDATE ON narrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_attachments_updated_at BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE nights ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Public read: only active season
CREATE POLICY "Public can view active seasons" ON seasons
  FOR SELECT USING (is_active = true);

-- Public read: only published nights
CREATE POLICY "Public can view published nights" ON nights
  FOR SELECT USING (status = 'published');

-- Public read: topics of published nights
CREATE POLICY "Public can view topics" ON topics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM nights WHERE nights.id = topics.night_id AND nights.status = 'published')
  );

-- Public read: verses of published nights
CREATE POLICY "Public can view verses" ON verses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM nights WHERE nights.id = verses.night_id AND nights.status = 'published')
  );

-- Public read: narrations of published nights
CREATE POLICY "Public can view narrations" ON narrations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM nights WHERE nights.id = narrations.night_id AND nights.status = 'published')
  );

-- Public read: resources of published nights
CREATE POLICY "Public can view resources" ON resources
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM nights WHERE nights.id = resources.night_id AND nights.status = 'published')
  );

-- Public read: only published cards
CREATE POLICY "Public can view published cards" ON cards
  FOR SELECT USING (status = 'published');

-- Public read: published attachments of published nights
CREATE POLICY "Public can view attachments" ON attachments
  FOR SELECT USING (
    status = 'published' AND
    EXISTS (SELECT 1 FROM nights WHERE nights.id = attachments.night_id AND nights.status = 'published')
  );

-- Admin full access policies (service role bypasses RLS, so these are for authenticated admin users)
-- You can add admin write policies here if using Supabase auth instead of service role
