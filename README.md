# My Mate Nasty V4 — Connected Preview

This package converts the approved V4 interface into a real Supabase-backed preview.

## Before uploading

1. In Supabase SQL Editor, run:
   `supabase/v4-security-and-signup-patch.sql`
2. Open `config.js` in Notepad.
3. Replace only:
   - `YOUR_SUPABASE_PROJECT_URL`
   - `YOUR_SUPABASE_PUBLISHABLE_KEY`
4. Never use a secret or service-role key.

## Deploy

Upload the contents of this folder to the existing `mymatenasty-v4-preview` GitHub repository, replacing `index.html` and adding the other files/folders.

Vercel settings remain:
- Framework Preset: Other
- Build Command: blank
- Output Directory: blank

## First test

1. Create a new test account using a new email address.
2. Verify the email.
3. Sign in.
4. Update the profile and upload an avatar.
5. Create a post with 1–3 photos.
6. Test a like and comment from a second test account.

Do not connect the main mymatenasty.com domain until this preview has passed testing.
