-- ============================================================
-- Migration 008: Quiz Attempts & Attempt Answers Schema
-- Phase 2.1 — Quiz Analytics Infrastructure
-- ============================================================

-- ─── 1. quiz_attempts: tracks each user's quiz session ───

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  -- user_id is nullable for now (anonymous users), will be enforced when auth is added
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Fingerprint for anonymous deduplication (IP hash or browser fingerprint)
  anonymous_id  TEXT,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at  TIMESTAMPTZ,
  score         NUMERIC(5,2),           -- percentage score (0.00 to 100.00)
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count   INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by quiz
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
-- Index for user history
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
-- Index for analytics time-range queries
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_submitted_at ON quiz_attempts(submitted_at);

-- ─── 2. quiz_attempt_answers: stores each answer the user selected ───
-- Named "quiz_attempt_answers" to avoid conflict with existing "quiz_answers" (answer options table)

CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_answer UUID REFERENCES quiz_answers(id) ON DELETE SET NULL,
  is_correct      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate answers for the same question in the same attempt
  UNIQUE(attempt_id, question_id)
);

-- Index for fast lookups by attempt
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt_id ON quiz_attempt_answers(attempt_id);
-- Index for per-question analytics
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_question_id ON quiz_attempt_answers(question_id);

-- ─── 3. Row Level Security ───

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempt_answers ENABLE ROW LEVEL SECURITY;

-- Public: anyone can INSERT their own attempt (anonymous quiz taking)
CREATE POLICY "Anyone can create quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (true);

-- Public: users can only read their own attempts (by user_id or anonymous_id)
CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (
    user_id = auth.uid()
    OR anonymous_id IS NOT NULL
  );

-- Public: anyone can INSERT their own attempt answers
CREATE POLICY "Anyone can create attempt answers" ON quiz_attempt_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
    )
  );

-- Public: users can view answers for their own attempts
CREATE POLICY "Users can view own attempt answers" ON quiz_attempt_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
      AND (quiz_attempts.user_id = auth.uid() OR quiz_attempts.anonymous_id IS NOT NULL)
    )
  );

-- Admin: full access for authenticated (admin) users
CREATE POLICY "Admins can manage quiz attempts" ON quiz_attempts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage attempt answers" ON quiz_attempt_answers
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─── 4. Notify PostgREST to reload schema cache ───
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- VERIFICATION: Run these queries after migration to confirm:
-- 
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'quiz_attempts' ORDER BY ordinal_position;
--
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'quiz_attempt_answers' ORDER BY ordinal_position;
--
-- -- Test insert:
-- INSERT INTO quiz_attempts (quiz_id, total_questions, correct_count, wrong_count, score, submitted_at)
-- VALUES ('<your-quiz-id>', 10, 7, 3, 70.00, NOW())
-- RETURNING id;
--
-- INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_answer, is_correct)
-- VALUES ('<attempt-id-from-above>', '<question-id>', '<answer-id>', true);
-- ============================================================
