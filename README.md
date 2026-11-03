# diogolara.dev

Personal website of **Diogo Lara**, a fullstack developer. Built with the Next.js App Router, TypeScript and Tailwind CSS, with English/Portuguese content and a language switcher.

> Work in progress — content and design are still evolving.

## Features

- **Bilingual UI (EN/PT)** — language switcher with preference persisted in `localStorage`.
- **Portfolio home** — hero, about section, project cards and contact form.
- **Blog** — post list filtered by the selected language, with posts written in both English and Portuguese.
- **Experience & Manifesto** pages.
- **Interactive mascot** page (Tuneba the hamster).
- **Contact form** — validated with `react-hook-form` + `zod` and delivered by email through [Resend](https://resend.com).
- **Animations** with Framer Motion, icons from Phosphor/Lucide, and toast notifications via Sonner.

## Tech stack

| Category   | Tools                                                        |
| ---------- | ------------------------------------------------------------ |
| Framework  | Next.js 15 (App Router), React 18, TypeScript                |
| Styling    | Tailwind CSS, PostCSS, Sass, `tailwindcss-animate`            |
| Components | shadcn/ui conventions, `class-variance-authority`, `clsx`    |
| Forms      | React Hook Form, Zod, `@hookform/resolvers`                  |
| Motion     | Framer Motion                                                |
| Email      | Resend                                                       |
| Theming    | `next-themes`, Sonner                                        |

## Getting started

### Requirements

- Node.js **18.20.3** (see `.nvmrc`) — `nvm use` will pick it up.
- A [Resend](https://resend.com) account and API key for the contact form.

### Install and run

```bash
# with pnpm (a pnpm-lock.yaml is committed)
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```bash
RESEND_TOKEN=your_resend_api_key
MAIL_RECEIVER=you@example.com
```

| Variable        | Description                                          |
| --------------- | ---------------------------------------------------- |
| `RESEND_TOKEN`  | Resend API key used to send contact-form emails.     |
| `MAIL_RECEIVER` | Destination address that receives contact messages.  |

Without these variables the site runs normally, but submitting the contact form will fail.

## Scripts

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start the development server.        |
| `pnpm build` | Create a production build.           |
| `pnpm start` | Serve the production build.          |
| `pnpm lint`  | Run ESLint via `next lint`.          |

The same commands work with `npm run <script>` or `yarn <script>`.

## Project structure

```text
src/
├── app/                  # App Router pages, layouts and API routes
│   ├── api/contact/      # Contact form endpoint (Resend)
│   ├── blog/             # Blog list and individual posts
│   ├── experience/
│   ├── manifesto/
│   ├── mascot/
│   └── ui/               # Global styles and CSS variables
├── components/           # Reusable UI components
├── contents/             # Page copy, links and localized texts
├── contracts/            # Shared TypeScript contracts
└── lib/                  # i18n provider, utilities
```

## Pages

| Route               | Description                             |
| ------------------- | --------------------------------------- |
| `/`                 | Hero, about, projects and contact form. |
| `/blog`             | Posts filtered by the active language.  |
| `/blog/post/<slug>` | Individual blog posts.                  |
| `/experience`       | Professional experience.                |
| `/manifesto`        | Personal manifesto.                     |
| `/mascot`           | Interactive mascot page.                |

## Internationalization

Translations live next to the content they describe (`src/contents/texts`) as `{ en, pt }` objects. Components consume them through the helpers in `src/lib/i18n.tsx`:

- `useLanguage()` — read/set the current language.
- `<T en="…" pt="…" />` — render a localized string.
- `<En>` / `<Pt>` — render children only for one language.

The selected language is stored under `diogo-lara:language` and applied to `<html lang>`.

## License

Personal project. Content and images belong to Diogo Lara unless stated otherwise.
