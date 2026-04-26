/*
  # Add minibio column to perfiles

  1. Changes
    - `perfiles.minibio` (text, default '') to allow agents to write a short bio
      displayed on their profile and public page.
  2. Security
    - No policy changes needed; existing RLS covers the column.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'perfiles' AND column_name = 'minibio'
  ) THEN
    ALTER TABLE public.perfiles ADD COLUMN minibio text DEFAULT '';
  END IF;
END $$;
