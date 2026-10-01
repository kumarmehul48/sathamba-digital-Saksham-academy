# Sathamba Digital Saksham Academy (SDSA)

> An initiative of **Shivansh Digital Sagacity & Alleviation** trust
> *Nurturing Wisdom, Sustaining Lives*

**Live site:** https://kumarmehul48.github.io/sathamba-digital-Saksham-academy/

---

## About

SDSA is a computer training institute and CSC (Common Service Center) coming up in **Sathamba, Aravalli district, Gujarat**. The mission is to take local students from zero to professional-level digital skills — with a structured curriculum, government-ready documentation, and digital services for the village.

## What the Academy Offers

**26-week structured curriculum** (7 modules, admin-editable):

1. Digital Foundation (weeks 1–4)
2. Internet & Digital Safety (weeks 5–7)
3. Office Productivity — Word, Excel, Presentations (weeks 8–14)
4. Cloud & Online Productivity (weeks 15–16)
5. AI Skills (weeks 17–20)
6. Practical Project Development (weeks 21–23)
7. Portfolio & Course Completion (weeks 24–26)

**Plus:** CSC Digital Seva counter services, admissions & enquiry support, certificates, and announcements.

## Site Structure

- **Public pages** — Home, About, Courses, Curriculum, CSC Seva, Contact
- **Student portal** — login, weekly curriculum, announcements
- **Admin dashboard** — Students, Enquiries, Admissions, Announcements management
- 43 verified page routes, floating WhatsApp contact button on every page
- Official trust logos: `sdsa-logo.webp`, `sdsa-trust-logo.webp`, `sdsa-badge.webp`, `SDSAENGLOGO.png`

## Backend

Runs on a centralized Google Sheet (**"SDSA Academy Data"**) on the trust's Google Drive with tabs: Admissions, Enquiries, Students, Admin, Announcements.

Three deployed Base44 backend functions:

- `sdsaSubmitLead` — website forms append rows to Admissions / Enquiries tabs
- `sdsaLogin` — student login (Students tab) and admin login (Admin tab)
- `sdsaGetData` — announcements feed for the student portal

## Tech Stack

- `platform/` — production React + TypeScript + Tailwind CSS + Vite app (43 routes)
- Static site published to GitHub Pages
- Mobile-responsive, fast, no external database required

## License

© 2026 Shivansh Digital Sagacity & Alleviation. All rights reserved.
