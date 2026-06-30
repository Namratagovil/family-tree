# Kunwar Sain Family Tree

A responsive, interactive family tree web application built with Next.js 14, Tailwind CSS, and shadcn/ui (Radix UI).

## Features

- **Infinite Canvas** (desktop/landscape): pan, pinch-to-zoom, zoom controls
- **List View** (mobile/portrait): collapsible accordion hierarchy
- **Profile Drawer**: click any member to see family connections
- **Photo Upload**: client-side crop to 300×300 + WebP compression — no server needed
- **Export Bundle**: downloads a `.json` file you can email to add photos permanently
- **Missing Connections**: pre-filled mailto link for reporting errors

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom palette) |
| Components | Radix UI (Dialog, Accordion) via shadcn/ui pattern |
| Icons | lucide-react |
| Hosting | Vercel (zero-config) |

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#F9F7F3` | Page background |
| Primary | `#004C2B` | Buttons, connectors, nav |
| Accent | `#F87B2A` | CTAs, missing-connection UI |
| Rose | `#C89588` | Tertiary avatar/tag |
| Teal | `#B4D4CF` | Jupad Sain branch |
| Beige | `#D2BF96` | Bhola Nath branch |
| Yellow | `#F5AC00` | Tertiary tag |

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect the repo in [vercel.com/new](https://vercel.com/new) — zero config needed.

## Crowd-sourced Photo Updates

1. Click a family member node → Profile Sheet opens
2. Drag or click the photo upload zone
3. Image is cropped to 300×300 and compressed to WebP client-side
4. Click **Export Update Bundle** → downloads `family-tree-update-<id>-<name>.json`
5. Send the file to `namratagovil@gmail.com` via email or WhatsApp

## Reporting Missing Connections

Inside any profile sheet, click **Report Missing Connection** — it opens a pre-filled email:

- **To:** `namratagovil@gmail.com`
- **Subject:** `Family Tree Update Request: [Full Name] ([ID])`
- **Body:** template prompting for the missing relative details

## Family Data

All members live in `src/data/familyData.ts` as a flat array. The tree is derived at runtime using the hierarchical ID convention:
- `1` = root (Kunwar Sain)
- `11`, `12` = generation 2
- `111`–`114`, `121`–`124` = generation 3
- … and so on — each ID's parent is found by removing the last digit.

To add a new member, append an entry with the correct `id`, `parentId`, and `generation`.
