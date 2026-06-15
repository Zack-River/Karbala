-- Publish attachments that were uploaded but left as draft (invisible on public site)
UPDATE attachments
SET status = 'published'
WHERE status = 'draft'
  AND file_url IS NOT NULL
  AND file_url != '';
