-- Create function to increment quiz completion
CREATE OR REPLACE FUNCTION public.increment_quiz_completion(user_id UUID, xp_earned INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_quizzes_completed = total_quizzes_completed + 1,
    total_xp = total_xp + xp_earned,
    level = FLOOR((total_xp + xp_earned) / 100) + 1,
    last_activity_date = CURRENT_DATE
  WHERE user_stats.user_id = increment_quiz_completion.user_id;
END;
$$;
