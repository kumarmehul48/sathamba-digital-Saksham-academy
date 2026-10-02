# Sathamba Digital Saksham Academy (SDSA)

An educational initiative of **Shivansh Digital Sagacity & Alleviation**.
Trust tagline: Nurturing Wisdom, Sustaining Lives.
Academy tagline: Learn • Practice • Apply • Grow.

Live website: https://kumarmehul48.github.io/sathamba-digital-Saksham-academy/

Public website deployed at repository root. React + TypeScript + Tailwind source is in `platform/`.
The public curriculum includes exactly 7 modules and 26 weeks.

## Backend status
Supabase is NOT configured on this deployment. Authentication, forms, student portal and admin data workflows require backend setup and testing. Do not treat this preview as a production student-data system. Never commit secret keys.

## Rebuild
```
cd platform
npm ci
SDSA_BASE_PATH=/sathamba-digital-Saksham-academy/ npm run build
```
Deploy generated dist contents to repository root, retaining source. GitHub Pages source: main branch, root.
Policies are drafts requiring review. No government affiliation, accreditation or trust registration is claimed.
