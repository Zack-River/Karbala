-- =========================================
-- Content Fix Script: وعي يمر من كربلاء
-- Run this in Supabase SQL Editor to fix all content issues
-- =========================================

-- 1. Fix corrupted Night 11 title
UPDATE nights SET title = 'الكسل مقبرة الذات' WHERE slug = 'night-11';

-- 2. Fix corrupted Night 12 title
UPDATE nights SET title = 'الوقف الخيري' WHERE slug = 'night-12';

-- 3. Fix corrupted Night 13 title  
UPDATE nights SET title = 'السؤال كقناع للنفس' WHERE slug = 'night-13';

-- 4. Publish Night 10 (المقتل) - it was stuck in draft status
UPDATE nights SET status = 'published' WHERE slug = 'night-10';

-- 5. Verify the fixes
SELECT number, title, slug, status FROM nights ORDER BY number;
