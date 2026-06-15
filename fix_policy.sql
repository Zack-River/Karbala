-- Fix the UPDATE policy to allow setting submitted_at to NOT NULL
DROP POLICY IF EXISTS "Public can update unsubmitted attempts" ON public.quiz_attempts;

CREATE POLICY "Public can update unsubmitted attempts" 
ON public.quiz_attempts 
FOR UPDATE 
USING (submitted_at IS NULL)
WITH CHECK (true);

-- Also fix getQuizStats error PGRST116 locally
