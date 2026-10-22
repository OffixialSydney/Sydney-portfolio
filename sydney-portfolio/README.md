# Sydney Portfolio

Windows-style portfolio. Next.js 14 + Supabase, deployed on Vercel.

## Setup
1. Create a Supabase project, open SQL Editor, run `supabase/schema.sql`.
2. Supabase > Authentication > Users > Add user (your admin email + password).
3. Copy `.env.example` to `.env.local` and fill in the two Supabase values.
4. Put your wallpaper image at `public/wallpaper.jpg` (a gradient shows if it is missing).
5. `npm install` then `npm run dev`.
6. Open `/admin`, log in, and add your profile, links, projects, experience, impact and education.

## Deploy
Push to GitHub, import the repo in Vercel, add the two env vars, deploy.
Then add your Vercel URL in Supabase > Authentication > URL Configuration.
# Sydney-portfolio
# Sydney-portfolio
