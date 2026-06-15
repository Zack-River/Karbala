-- Ensure sheikh profile row exists (homepage query requires is_visible = true)
INSERT INTO sheikh_profile (id, name, image, is_visible)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'سماحة الشيخ جعفر الصويلح',
  '/sheikh-profile.jpg',
  true
)
ON CONFLICT (id) DO UPDATE SET
  is_visible = EXCLUDED.is_visible,
  name = COALESCE(NULLIF(sheikh_profile.name, ''), EXCLUDED.name);
