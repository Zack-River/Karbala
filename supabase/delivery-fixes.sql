-- =========================================
-- DELIVERY FIXES: وعي يمر من كربلاء
-- Run this in Supabase SQL Editor to fix all remaining blockers
-- =========================================

-- ───────────────────────────────────────
-- 1. BLOCKER: Homepage shows "لا توجد بطاقات مميزة حالياً"
--    FIX: Mark 6 cards as featured for the homepage excerpts section
-- ───────────────────────────────────────

UPDATE cards SET featured = true WHERE slug IN (
  'quote-night-1',
  'reflection-night-1',
  'quote-night-4',
  'reflection-night-6',
  'quote-night-9',
  'quote-night-13'
);

-- ───────────────────────────────────────
-- 2. BLOCKER: Night 10 is published but has ZERO content
--    FIX: Revert to draft so it doesn't show as an empty page
-- ───────────────────────────────────────

UPDATE nights SET status = 'draft' WHERE slug = 'night-10';

-- ───────────────────────────────────────
-- 3. BLOCKER: Zero quizzes exist — quiz pipeline untestable
--    FIX: Create a sample quiz for Night 1 with 5 questions
-- ───────────────────────────────────────

INSERT INTO quizzes (id, night_id, title, is_enabled, opens_at, motivational_message)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001',
  '22222222-2222-2222-2222-222222220001',
  'اختبار الليلة الأولى',
  true,
  NULL,
  NULL
);

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question, sort_order)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'ما الفكرة المركزية لليلة الأولى؟', 1);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccc000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00001', 'عاشوراء مجرد حدث تاريخي للبكاء', false, 1),
('cccccccc-cccc-cccc-cccc-cccccc000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00001', 'عاشوراء مشروع وعي ومسؤولية، والمشكلة حين لا يتحول الحب إلى موقف', true, 2),
('cccccccc-cccc-cccc-cccc-cccccc000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00001', 'عاشوراء مناسبة اجتماعية فقط', false, 3),
('cccccccc-cccc-cccc-cccc-cccccc000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00001', 'عاشوراء حدث لا علاقة له بالحاضر', false, 4);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question, sort_order)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'ما الخطر الذي حذرت منه الليلة الأولى؟', 2);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccc000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00002', 'نسيان الحسين (ع)', false, 1),
('cccccccc-cccc-cccc-cccc-cccccc000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00002', 'الاعتياد على عاشوراء دون أن تغيّرنا', true, 2),
('cccccccc-cccc-cccc-cccc-cccccc000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00002', 'كثرة البكاء', false, 3),
('cccccccc-cccc-cccc-cccc-cccccc000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00002', 'حضور المجالس', false, 4);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question, sort_order)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'ما معنى "عيش عاشوراء" وفق الليلة؟', 3);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccc000009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00003', 'حضور المجالس سنوياً', false, 1),
('cccccccc-cccc-cccc-cccc-cccccc000010', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00003', 'البكاء فقط', false, 2),
('cccccccc-cccc-cccc-cccc-cccccc000011', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00003', 'أن يتحول الحب إلى موقف يغير الإنسان', true, 3),
('cccccccc-cccc-cccc-cccc-cccccc000012', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00003', 'قراءة الكتب عن كربلاء', false, 4);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question, sort_order)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'ماذا قال الإمام الحسين (ع) عن سبب خروجه؟', 4);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccc000013', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00004', 'خرجت طلباً للسلطة', false, 1),
('cccccccc-cccc-cccc-cccc-cccccc000014', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00004', 'إنما خرجت لطلب الإصلاح', true, 2),
('cccccccc-cccc-cccc-cccc-cccccc000015', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00004', 'خرجت هرباً من المدينة', false, 3),
('cccccccc-cccc-cccc-cccc-cccccc000016', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00004', 'خرجت بطلب من أهل الكوفة فقط', false, 4);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question, sort_order)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'ما الخطوة العملية المقترحة بعد الليلة الأولى؟', 5);

INSERT INTO quiz_answers (id, question_id, answer_text, is_correct, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccc000017', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00005', 'حضور مجلس عزاء كل يوم', false, 1),
('cccccccc-cccc-cccc-cccc-cccccc000018', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00005', 'مشاركة المنشورات على السوشيال ميديا', false, 2),
('cccccccc-cccc-cccc-cccc-cccccc000019', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00005', 'اختيار قيمة حسينية والالتزام بها 30 يوماً', true, 3),
('cccccccc-cccc-cccc-cccc-cccccc000020', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbb00005', 'قراءة زيارة عاشوراء يومياً', false, 4);


-- ───────────────────────────────────────
-- 4. BLOCKER: Zero majalis content
--    FIX: Create 3 sample majalis
-- ───────────────────────────────────────

INSERT INTO majalis (id, name, address, location_description, google_maps_url, is_enabled, sort_order) VALUES
('dddddddd-dddd-dddd-dddd-ddddddddd001', 'حسينية المنار', 'شارع الإمام الحسين، المنطقة الشرقية', 'القطيف', 'https://maps.google.com/?q=القطيف', true, 1),
('dddddddd-dddd-dddd-dddd-ddddddddd002', 'مجلس آل سيف', 'حي الديرة، المبنى رقم 12', 'سيهات', 'https://maps.google.com/?q=سيهات', true, 2),
('dddddddd-dddd-dddd-dddd-ddddddddd003', 'حسينية الزهراء (ع)', 'شارع الخليج، بجوار المركز الصحي', 'صفوى', 'https://maps.google.com/?q=صفوى', true, 3);

-- ───────────────────────────────────────
-- 5. Verify all fixes
-- ───────────────────────────────────────

SELECT 'Featured Cards' AS check_name, COUNT(*) AS count FROM cards WHERE featured = true;
SELECT 'Night 10 Status' AS check_name, status FROM nights WHERE slug = 'night-10';
SELECT 'Quizzes' AS check_name, COUNT(*) AS count FROM quizzes;
SELECT 'Quiz Questions' AS check_name, COUNT(*) AS count FROM quiz_questions;
SELECT 'Quiz Answers' AS check_name, COUNT(*) AS count FROM quiz_answers;
SELECT 'Majalis' AS check_name, COUNT(*) AS count FROM majalis;
