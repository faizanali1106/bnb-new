# Bit & Bytes website

The Bit & Bytes site (all bnb-portfolio content, pages, CMS and forms) rebuilt with the
replicated Dapper-style components and motion: floating pill nav with springy mega-menu tiles,
page-cover transitions, split-word headline reveals, Lenis smooth scroll + GSAP ScrollTrigger,
twinkling pixel clusters, grain overlay, sticky scroll sections and draggable carousels.
Brand colour is the bnb primary `#673493` (light) / `#c4a5f5` (dark), with cyan `#26b1ce` as a
secondary accent.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build && npm start`.

Env vars live in `.env` / `.env.local` (copied from bnb-portfolio; see `.env.example`):
Supabase (CMS content, careers applications, uploads), EmailJS (contact + application emails),
reCAPTCHA v2, Slack webhook, CMS admin password, cron secret.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero with animated circuit mark, client logo marquee, situations, offer ladder (sticky phone), 10 service areas, featured work carousel, products, process timeline, team ring, why us, industries, testimonials, stack, FAQ, enquiry form |
| `/services`, `/services/[slug]` | Service index (sticky groups), group pages, and core/sub service pages (20-section template for core services) |
| `/offers/[offer]` | AI Discovery Workshop, AI Pilot, AI Pod |
| `/industries`, `/industries/[industry]` | Industry index and detail pages |
| `/work`, `/work/[slug]` | Filterable case studies, products, core projects, case study pages |
| `/company`, `/company/team` | Story, how we work, beliefs, numbers, team directory (from CMS) |
| `/careers`, `/careers/[id]`, `/careers/thank-you` | Jobs from CMS, search + infinite list, job detail with application form (resume auto-fill, duplicate check, screening questions) |
| `/contact`, `/resources`, `/trust` | Contact form + map, guides/articles/FAQ, trust centre |
| `/admin` | CMS (projects, jobs, team, testimonials, applications) — unchanged functionality |

## Where things are

- **Content:** `src/data/*` (services, offers, work, industries, nav, site copy) — same files as bnb-portfolio.
  CMS-managed content (jobs, team, testimonials, socials, footer tagline) loads from Supabase via
  `src/lib/cms/load-from-supabase.ts`, falling back to `src/lib/cms/defaults.ts`.
- **Design tokens & styles:** `src/app/globals.css` (top of file). Fonts in `src/app/layout.tsx`.
- **Building blocks:** `src/components/blocks/*` (sections, cards, forms, FAQ, carousels),
  `src/components/ui/*` (buttons, arrows, split text, reveals, pixels), `src/components/home/*`.
- **Backend:** `src/app/api/*` and `src/lib/*` (ported from bnb-portfolio to Next 16).
