# SDSA Academy Platform Foundation

Academy: Sathamba Digital Saksham Academy (SDSA)
Managing trust: Shivansh Digital Sagacity & Alleviation
Trust tagline: Nurturing Wisdom, Sustaining Lives.
Academy tagline: Learn • Practice • Apply • Grow.
Location: Sathamba, Aravalli District, Gujarat.

## Current deployment
Public website preview on GitHub Pages. Supabase is not configured on this deployment.
Public pages include the supplied 7-module, 26-week curriculum. Workbook content remains unpublished until supplied.
Student and admin screens exist in source but are NOT validated production workflows.
Authentication and data submission need a real backend. Policies are draft text, not legal compliance certification.

## Local setup
npm ci
npm run dev

## GitHub Pages build
SDSA_BASE_PATH=/sathamba-digital-Saksham-academy/ npm run build
Publish dist contents to repository root. SPA basename follows Vite BASE_URL.
Keep source in platform/ and never commit .env files or service-role keys.

## Backend preparation
Review supabase/schema.sql and seed.sql before applying to a new Supabase project.
Add project URL and publishable/anon key through environment variables.
Do not put service-role credentials in frontend code.
Complete a security review, assigned-batch authorization, storage validation, audit recording,
account invitations, report filters, certificate downloads, backup/restore testing, and end-to-end tests
before collecting real student data. A successful TypeScript build is not a security audit.

## Identity and content
No government affiliation, accreditation, job guarantees, registered-trust status or tax exemption is claimed.
Contact/batch/fee details need owner confirmation before launch as an operational academy.
