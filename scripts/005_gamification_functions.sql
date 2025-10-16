-- Create function to increment flashcards studied
CREATE OR REPLACE FUNCTION public.increment_flashcards_studied(user_id UUID, cards_count INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_flashcards_studied = total_flashcards_studied + cards_count,
    total_xp = total_xp + (cards_count * 2),
    level = FLOOR((total_xp + (cards_count * 2)) / 100) + 1,
    last_activity_date = CURRENT_DATE
  WHERE user_stats.user_id = increment_flashcards_studied.user_id;
END;
$$;

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_stat RECORD;
  badge RECORD;
BEGIN
  -- Get user stats
  SELECT * INTO user_stat FROM public.user_stats WHERE user_stats.user_id = check_and_award_badges.user_id;

  -- Check each badge requirement
  FOR badge IN SELECT * FROM public.badges LOOP
    -- Check if user already has this badge
    IF NOT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_badges.user_id = check_and_award_badges.user_id 
      AND user_badges.badge_id = badge.id
    ) THEN
      -- Check if user meets the requirement
      IF (badge.requirement_type = 'messages' AND user_stat.total_messages >= badge.requirement_value) OR
         (badge.requirement_type = 'quizzes' AND user_stat.total_quizzes_completed >= badge.requirement_value) OR
         (badge.requirement_type = 'flashcards' AND user_stat.total_flashcards_studied >= badge.requirement_value) OR
         (badge.requirement_type = 'streak' AND user_stat.current_streak >= badge.requirement_value) THEN
        -- Award the badge
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (check_and_award_badges.user_id, badge.id);
      END IF;
    END IF;
  END LOOP;
END;
$$;

-- Create trigger to check badges after stats update
CREATE OR REPLACE FUNCTION public.trigger_check_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_badges_after_stats_update ON public.user_stats;

CREATE TRIGGER check_badges_after_stats_update
  AFTER UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_check_badges();
