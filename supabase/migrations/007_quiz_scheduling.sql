-- Add scheduling fields to quizzes table
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS closes_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

-- Update RLS for quiz questions to hide them before opens_at
DROP POLICY IF EXISTS "Public can view quiz questions" ON quiz_questions;
CREATE POLICY "Public can view quiz questions" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN nights ON nights.id = quizzes.night_id
      WHERE quizzes.id = quiz_questions.quiz_id
        AND quizzes.is_enabled = true
        AND nights.status = 'published'
        AND (quizzes.opens_at IS NULL OR quizzes.opens_at <= NOW())
    )
  );

-- Update RLS for quiz answers to hide them before opens_at
DROP POLICY IF EXISTS "Public can view quiz answers" ON quiz_answers;
CREATE POLICY "Public can view quiz answers" ON quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_questions
      JOIN quizzes ON quizzes.id = quiz_questions.quiz_id
      JOIN nights ON nights.id = quizzes.night_id
      WHERE quiz_questions.id = quiz_answers.question_id
        AND quizzes.is_enabled = true
        AND nights.status = 'published'
        AND (quizzes.opens_at IS NULL OR quizzes.opens_at <= NOW())
    )
  );
