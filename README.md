# Viral Short Architect

AI-powered viral short video script generator for TikTok, Facebook Reels, and YouTube Shorts.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with:

   ```env
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Tech Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Shadcn/ui components
- OpenAI GPT-4o-mini
- Supabase + Drizzle ORM
