# FestoWeb CRM

A modern, full-stack CRM for FestoWeb digital agency.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (dark mode, #121212)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Charts**: Recharts
- **PDF**: jsPDF + AutoTable
- **Drag & Drop**: dnd-kit
- **Forms**: React Hook Form + Zod
- **State**: Zustand

## Quick Start
```bash
npm install
cp .env.local.example .env.local
# Add your Supabase keys to .env.local
npm run dev
```
Open http://localhost:3000

## Modules
1. Dashboard — KPIs + Charts
2. Clients — Full CRUD + file uploads
3. Pipeline — Kanban drag & drop
4. Projects — Status + profitability
5. Invoices — PDF export + payment proof
6. Expenses — Category tracking
7. File Vault — Secure storage
8. Notifications — Alert center
9. Settings — Agency config
