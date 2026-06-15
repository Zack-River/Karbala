# وعيٌ يمرّ من كربلاء (Karbala Awareness Platform)

A premium, interactive educational platform designed to present the Islamic season "وعي يمر من كربلاء" through structured nights, reflections, and deep insights. Built with Next.js 14 and Supabase.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables (Dark Luxury Theme)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Middleware protected Admin routes)
- **Storage:** Supabase Storage (Audio, PDFs, Covers)
- **State Management:** React Hooks + Server Actions
- **Icons:** Lucide React

## 📦 Project Structure

- `/src/app`: Next.js App Router pages (Public and Admin routes)
- `/src/components`: Reusable UI components (Forms, Tables, Layouts)
- `/src/lib`: Supabase clients, utilities, and helper functions
- `/src/constants`: Static application data and configurations
- `/public`: Static assets (Fonts, Hero Images, SEO files)
- `/supabase`: Database migrations and seed data
- `/scripts`: Utility scripts for parsing and generating seed SQL

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd qarbla
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the example file and populate it with your local or remote Supabase credentials.
   ```bash
   cp .env.local.example .env.local
   ```
   *Note: See DEPLOYMENT.md for detailed environment variable descriptions.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Public Site: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`

## 🛠 Development Workflow

- **Styling:** We use a strict dark luxury design system. Stick to predefined Tailwind classes and custom tokens in `tailwind.config.ts`.
- **Database Mutations:** All secure database operations are handled via Next.js Server Actions (`src/app/actions`) using the Supabase Service Role client to bypass RLS for admin tasks.
- **Data Fetching:** Public data is fetched using the Supabase Anon client with standard RLS policies ensuring only `published` entities are readable.
- **Icons & Assets:** Do not rely on external CDN images; keep all high-fidelity assets in `public/` or in the configured Supabase Storage buckets.
