-- Create an RPC function to securely delete the current authenticated user.
-- This bypasses the need for a service_role key on the client/edge while strictly enforcing RLS-style deletion using auth.uid().
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
