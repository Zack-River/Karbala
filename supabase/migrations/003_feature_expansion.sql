-- =========================================
-- Feature Expansion Migration
-- Sheikh Profile, Quizzes, Majalis, Enhanced Cards & Media
-- =========================================

-- ─── Extend Card Types ───
ALTER TYPE card_type ADD VALUE IF NOT EXISTS 'benefit';
ALTER TYPE card_type ADD VALUE IF NOT EXISTS 'question';
ALTER TYPE card_type ADD VALUE IF NOT EXISTS 'note';
ALTER TYPE card_type ADD VALUE IF NOT EXISTS 'excerpt';

-- ─── Extend Nights (Audio/Video) ───
ALTER TABLE nights ADD COLUMN IF NOT EXISTS video_file TEXT;
ALTER TABLE nights ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE nights ADD COLUMN IF NOT EXISTS show_audio BOOLEAN DEFAULT true;
ALTER TABLE nights ADD COLUMN IF NOT EXISTS show_video BOOLEAN DEFAULT true;

-- ─── Extend Cards (Image Layout) ───
ALTER TABLE cards ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'top';

-- ─── Sheikh Profile ───
CREATE TABLE IF NOT EXISTS sheikh_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Quizzes ───
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  night_id UUID NOT NULL REFERENCES nights(id) ON DELETE CASCADE,
  title TEXT,
  is_enabled BOOLEAN DEFAULT false,
  opens_at TIMESTAMPTZ,
  motivational_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(night_id)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Majalis ───
CREATE TABLE IF NOT EXISTS majalis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  location_description TEXT,
  google_maps_url TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_quizzes_night ON quizzes(night_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_majalis_enabled ON majalis(is_enabled);
CREATE INDEX IF NOT EXISTS idx_majalis_sort ON majalis(sort_order);

-- ─── Updated At Triggers ───
CREATE TRIGGER set_sheikh_profile_updated_at BEFORE UPDATE ON sheikh_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_quiz_answers_updated_at BEFORE UPDATE ON quiz_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_majalis_updated_at BEFORE UPDATE ON majalis FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───
ALTER TABLE sheikh_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE majalis ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view visible sheikh profile" ON sheikh_profile
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view enabled quizzes" ON quizzes
  FOR SELECT USING (
    is_enabled = true AND
    EXISTS (SELECT 1 FROM nights WHERE nights.id = quizzes.night_id AND nights.status = 'published')
  );

CREATE POLICY "Public can view quiz questions" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN nights ON nights.id = quizzes.night_id
      WHERE quizzes.id = quiz_questions.quiz_id
        AND quizzes.is_enabled = true
        AND nights.status = 'published'
    )
  );

CREATE POLICY "Public can view quiz answers" ON quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      JOIN nights ON nights.id = quizzes.night_id
      WHERE quiz_questions.id = quiz_answers.question_id
        AND quizzes.is_enabled = true
        AND nights.status = 'published'
    )
  );

CREATE POLICY "Public can view enabled majalis" ON majalis
  FOR SELECT USING (is_enabled = true);

-- Admin policies
CREATE POLICY "Authenticated users can manage sheikh profile" ON sheikh_profile
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quizzes" ON quizzes
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quiz questions" ON quiz_questions
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quiz answers" ON quiz_answers
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage majalis" ON majalis
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Seed Sheikh Profile ───
INSERT INTO sheikh_profile (id, name, image, is_visible)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'سماحة الشيخ جعفر الصويلح',
  '/sheikh-profile.jpg',
  true
)
ON CONFLICT (id) DO NOTHING;
