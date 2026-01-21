# HOKS - Hybrid Operations Knowledge System

A Next.js-based knowledge management system designed for operational teams.

## Features

- 📚 **Wiki** - Centralized knowledge base
- 🔍 **Command K Search** - Instant SOP lookup
- ✏️ **Web Editor** - No-code content management
- 🎓 **Learning Mode** - Structured training paths
- 🧮 **Interactive Components** - Calculators, checklists, scripts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Content**: MDX with interactive components
- **Deployment**: Render

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Project Structure

```
├── content/              # MDX content files
│   ├── 00_Onboarding/
│   ├── 01_Knowledge_Base/
│   ├── 02_Tools_Tech/
│   ├── 03_Campaign_Ops/
│   ├── 04_Risk_CS/
│   └── 05_Daily_Routine/
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   └── lib/             # Utilities
└── render.yaml          # Render deployment config
```

## License

Private - Internal Use Only
