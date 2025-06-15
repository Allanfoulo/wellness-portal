
-- Fix the auth.users table schema issues by setting proper defaults for NULL columns
UPDATE auth.users 
SET 
  email_change = '',
  email_change_token_new = '',
  email_change_token_current = '',
  recovery_token = '',
  email_change_confirm_status = 0
WHERE email_change IS NULL 
   OR email_change_token_new IS NULL 
   OR email_change_token_current IS NULL 
   OR recovery_token IS NULL;

-- Also ensure the users have proper confirmation status
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN ('admin@elysian.com', 'user@elysian.com') 
  AND email_confirmed_at IS NULL;
