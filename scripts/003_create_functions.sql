-- Create function to increment user message count
CREATE OR REPLACE FUNCTION public.increment_user_messages(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_messages = total_messages + 1,
    total_xp = total_xp + 5,
    last_activity_date = CURRENT_DATE
  WHERE user_stats.user_id = increment_user_messages.user_id;
END;
$$;

-- Create function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_date DATE;
  current_streak_val INTEGER;
BEGIN
  SELECT last_activity_date, current_streak
  INTO last_date, current_streak_val
  FROM public.user_stats
  WHERE user_stats.user_id = update_user_streak.user_id;

  IF last_date IS NULL OR last_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Reset streak if more than 1 day has passed
    IF last_date < CURRENT_DATE - INTERVAL '1 day' THEN
      current_streak_val := 1;
    ELSE
      current_streak_val := current_streak_val + 1;
    END IF;

    UPDATE public.user_stats
    SET 
      current_streak = current_streak_val,
      longest_streak = GREATEST(longest_streak, current_streak_val),
      last_activity_date = CURRENT_DATE
    WHERE user_stats.user_id = update_user_streak.user_id;
  END IF;
END;
$$;
