-- ============================================================
-- Migration 009: Quiz Stats View
-- Phase 2.4 — Quiz Analytics Infrastructure
-- ============================================================

-- Create a view to easily query aggregated stats per quiz
CREATE OR REPLACE VIEW quiz_stats_view AS
SELECT 
  quiz_id,
  COUNT(id) AS total_attempts,
  COUNT(CASE WHEN score = 100 THEN 1 END) AS perfect_score_count,
  COALESCE(SUM(wrong_count), 0) AS total_errors,
  CASE 
    WHEN COUNT(id) > 0 THEN 
      ROUND((COUNT(CASE WHEN score >= 50 THEN 1 END)::numeric / COUNT(id)::numeric) * 100, 2)
    ELSE 0 
  END AS pass_rate,
  CASE 
    WHEN COUNT(id) > 0 THEN 
      ROUND(AVG(score)::numeric, 2)
    ELSE 0 
  END AS average_score
FROM quiz_attempts
WHERE submitted_at IS NOT NULL -- Only count completed attempts
GROUP BY quiz_id;

-- Grant access to the view
-- Public users can read stats (needed for the public stats display)
GRANT SELECT ON quiz_stats_view TO anon;
GRANT SELECT ON quiz_stats_view TO authenticated;
GRANT SELECT ON quiz_stats_view TO service_role;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- VERIFICATION: Run these queries after migration to confirm:
-- 
-- SELECT * FROM quiz_stats_view;
-- ============================================================
