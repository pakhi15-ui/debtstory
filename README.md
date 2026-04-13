# DebtStory 📈

**AI-powered data journalism. Every country's debt has a story.**

Live demo → [debtstory.vercel.app](https://debtstory.vercel.app)

---

## What it does

DebtStory fetches real government debt data from the World Bank API and uses an LLM to generate compelling, journalist-style narratives about each country's economic history — wars, crises, recoveries, all told through data.

## Features

- 🌍 **Live World Bank data** — real debt-to-GDP ratios from 1990 to present
- 🤖 **AI narration** — LLM generates a unique story for each country on every load
- 📊 **Interactive chart** — built with Recharts + Monaco-style dark theme
- 🗞️ **Key events timeline** — major economic turning points with context
- ⚡ **Fast & responsive** — built with Next.js 14 + Tailwind CSS

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| AI | Groq API (Llama 3) |
| Data | World Bank Open API |
| Hosting | Vercel |

## Getting Started

```bash
git clone https://github.com/pakhi15-ui/debtstory.git
cd debtstory
npm install
```

Create a `.env.local` file: