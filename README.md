# 🚀 Premium Developer Portfolio v2.0

A state-of-the-art, professional portfolio built with **Next.js 15**, **Supabase**, and **Tailwind CSS**. Designed for high-performance showcases with a full-featured admin management system.

![Portfolio Preview](https://raw.githubusercontent.com/chartaphylus/My-Portofolio/main/public/image/Logo.png)

## ✨ Core Features

### 🌌 Public Showcase
- **Premium Aesthetics**: Modern "Frosted Glass" UI with dynamic background blobs and glassmorphism.
- **Interactive Backgrounds**: Orbiting particles and custom cursors for an immersive experience.
- **Dynamic Content**: Real-time fetching of Projects, Skills, Experience, and Education from Supabase.
- **Project Archive**: Filterable projects with multi-image support and live/source links.
- **Premium Loading States**: Custom futuristic loading animations across all pages.
- **Responsive & SEO Optimized**: Flawless experience on all devices with meta tags for search engines.

### 🛡️ Admin Dashboard
- **Secure Infrastructure**: Protected by Supabase Authentication.
- **Analytics Overview**: Visualized visitor statistics using Recharts.
- **Full CRUD Support**: Manage all portfolio data via intuitive slide-out drawer interfaces.
- **Direct Media Management**: Integrated Supabase Storage with automated cleanup (auto-delete orphan files).
- **Custom Notifications**: Integrated toast system and confirmation modals for all operations.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4.0+](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Analytics**: [Recharts](https://recharts.org/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js 18.x or later
- Supabase Account

### 2. Installation
```bash
git clone https://github.com/chartaphylus/My-Portofolio.git
cd My-Portofolio
npm install
```

### 3. Database Configuration
1. Go to your [Supabase SQL Editor](https://app.supabase.com/).
2. Copy the contents of `supabase/full_setup.sql` into the editor.
3. Run the script to initialize tables, RLS policies, storage buckets, and initial data.

### 4. Environment Variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Telegram Bot for Contact Form Notifications
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 5. Launch
```bash
npm run dev
```

## 📂 Project Structure
```text
src/
├── app/              # Next.js App Router (Public & Admin)
├── components/       # Reusable UI (Admin & Public)
├── lib/              # Supabase, Storage, & Utilities
├── types/            # TypeScript Interface Definitions
└── styles/           # Tailwind Configuration & Global CSS
supabase/             # Unified Database Schema & Setup
```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [M. Khafid Bahtiar](https://github.com/chartaphylus)
