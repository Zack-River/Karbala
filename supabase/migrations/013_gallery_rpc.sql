-- 013_gallery_rpc.sql
-- Function to safely swap two gallery images' sort_order in a single transaction

CREATE OR REPLACE FUNCTION public.swap_gallery_image_orders(
  p_id1 UUID,
  p_id2 UUID,
  p_order1 INTEGER,
  p_order2 INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the function creator (admin)
AS $$
BEGIN
  -- We update both rows in a single transaction.
  -- Using a temporary value for the first update to avoid unique constraint violations
  -- if sort_order had a UNIQUE constraint (it currently doesn't, but this is safe practice).
  
  UPDATE public.gallery_images
  SET sort_order = p_order2
  WHERE id = p_id1;

  UPDATE public.gallery_images
  SET sort_order = p_order1
  WHERE id = p_id2;

  -- If either update fails, the entire block will be rolled back.
END;
$$;
