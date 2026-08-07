# My Mate Nasty — Simple Live Build

This is the simplified launch version.

## What it does
- Public minimal homepage
- Email/password signup and login
- Email verification via Supabase
- One shared member gallery
- Up to 10 images per upload
- Optional caption
- Full-screen photo viewer
- Users can delete their own uploads
- Admin can delete any upload
- Automatic browser resize/re-encode before upload

## Important
This package intentionally DOES NOT contain `config.js`.

When updating the existing `mymatenasty-v4-preview` GitHub repository, leave its current `config.js` untouched. It already contains the browser-safe Supabase Project URL and publishable key that were configured earlier.

No new SQL migration is required; this build uses the existing V4 Supabase schema and storage policies.

## Deploy
Replace/upload:
- `index.html`
- `styles.css`
- `app.js`

Keep:
- `config.js`

Vercel will redeploy automatically from GitHub.
