# 🎬 Viral Shorts

<div align="center">
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://viral-short. vercel.app/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

  **Nền tảng tạo và quản lý video viral ngắn được hỗ trợ bởi AI**

  [🌐 Demo Trực Tiếp](https://viral-short.vercel.app/) · [🐛 Báo Lỗi](https://github.com/PhanNhatTien090/Viral-shorts/issues) · [✨ Yêu Cầu Tính Năng](https://github.com/PhanNhatTien090/Viral-shorts/issues)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Kiến Trúc Dự Án](#-kiến-trúc-dự-án)
- [Bắt Đầu](#-bắt-đầu)
- [Cấu Hình](#-cấu-hình)
- [Scripts](#-scripts)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới Thiệu

**Viral Shorts** là một nền tảng web hiện đại giúp người dùng tạo, quản lý và tối ưu hóa video viral ngắn.  Được xây dựng với công nghệ AI tiên tiến và kiến trúc scalable, dự án này cung cấp trải nghiệm mượt mà cho việc sáng tạo nội dung.

### 🌟 Điểm Nổi Bật

- ⚡ **Hiệu suất cao** với Next.js 16 và React 19
- 🤖 **Tích hợp AI** thông qua OpenAI và Google AI SDK
- 🎨 **UI/UX đẹp mắt** với Tailwind CSS và Framer Motion
- 🔐 **Xác thực an toàn** với Clerk
- 💾 **Database mạnh mẽ** với Supabase và Drizzle ORM
- 📱 **Responsive** trên mọi thiết bị

---

## ✨ Tính Năng

### 🎥 Quản Lý Video
- ✅ Tạo và chỉnh sửa video ngắn
- ✅ Upload và quản lý media
- ✅ Preview real-time
- ✅ Export nhiều định dạng

### 🤖 AI-Powered
- ✅ Gợi ý nội dung thông minh
- ✅ Tự động tạo caption
- ✅ Phân tích xu hướng
- ✅ Tối ưu hóa viral score

### 👤 Quản Lý Người Dùng
- ✅ Đăng ký/Đăng nhập với Clerk
- ✅ Profile cá nhân
- ✅ Dashboard quản lý
- ✅ History và analytics

### 🎨 Giao Diện
- ✅ Dark/Light mode
- ✅ Animation mượt mà
- ✅ Responsive design
- ✅ Modern UI components

---

## 🛠 Công Nghệ

### Frontend
- **[Next.js 16.1](https://nextjs.org/)** - React Framework
- **[React 19.2](https://react.dev/)** - UI Library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type Safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI Components
- **[Lucide React](https://lucide.dev/)** - Icons

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Database

### AI & APIs
- **[OpenAI SDK](https://platform.openai.com/)** - AI Integration
- **[Google AI SDK](https://ai.google.dev/)** - AI Services
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI Utilities

### Authentication
- **[Clerk](https://clerk.com/)** - User Management & Auth

### Development Tools
- **[ESLint](https://eslint.org/)** - Linting
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database Migrations
- **[PostCSS](https://postcss.org/)** - CSS Processing

---

## 🏗 Kiến Trúc Dự Án

Dự án được tổ chức theo **Atomic Design** và **Feature-First Architecture**:

```
viral-shorts/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components (Atomic Design)
│   │   ├── atoms/       # Basic UI elements
│   │   ├── molecules/   # Composite components
│   │   └── organisms/   # Complex sections
│   ├── features/        # Domain-specific features
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── videos/
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party integrations
│   │   ├── db/         # Database schemas
│   │   └── supabase/   # Supabase config
│   └── types/           # TypeScript definitions
├── public/              # Static assets
└── scripts/             # Utility scripts
```

### 📚 Tài Liệu Bổ Sung

- [📖 Component Guide](./COMPONENT_GUIDE.md) - Hướng dẫn sử dụng components
- [⚡ Caching Guide](./CACHING_GUIDE.md) - Chiến lược caching
- [🔑 API Key Setup](./FIX_API_KEY. md) - Cấu hình API keys

---

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **npm** hoặc **yarn** hoặc **pnpm**
- **Git**

### Cài Đặt

1. **Clone repository**
```bash
git clone https://github.com/PhanNhatTien090/Viral-shorts.git
cd Viral-shorts
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Cấu hình biến môi trường**
```bash
cp .env.example . env.local
```

Chỉnh sửa file `.env.local` với các thông tin của bạn:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Database
DATABASE_URL=your_database_url
```

4. **Setup database**
```bash
npm run db:push
```

5. **Chạy development server**
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## ⚙️ Cấu Hình

### Database Setup

1. Tạo project trên [Supabase](https://supabase.com/)
2. Copy connection string vào `DATABASE_URL`
3. Chạy migrations:
```bash
npm run db:generate  # Tạo migration files
npm run db:push      # Apply changes to database
```

### Authentication Setup

1. Tạo application trên [Clerk](https://clerk.com/)
2. Copy API keys vào `.env.local`
3. Cấu hình redirect URLs trong Clerk Dashboard

### AI Services Setup

Chi tiết cấu hình AI services xem tại:  [FIX_API_KEY.md](./FIX_API_KEY.md)

---

## 📜 Scripts

```bash
# Development
npm run dev          # Chạy dev server (localhost:3000)

# Build
npm run build        # Build production
npm run start        # Start production server

# Code Quality
npm run lint         # Chạy ESLint

# Database
npm run db:push      # Push schema changes
npm run db:studio    # Mở Drizzle Studio
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
```

---

## 📁 Cấu Trúc Thư Mục

```
📦 Viral-shorts
├── 📂 public/                    # Static files
├── 📂 scripts/                   # Utility scripts
├── 📂 src/
│   ├── 📂 app/                  # Next.js App Router
│   │   ├── 📄 layout.tsx        # Root layout
│   │   ├── 📄 page.tsx          # Home page
│   │   └── 📂 api/              # API routes
│   ├── 📂 components/           # UI Components
│   │   ├── 📂 atoms/            # Basic elements
│   │   ├── 📂 molecules/        # Composite components
│   │   └── 📂 organisms/        # Complex sections
│   ├── 📂 features/             # Feature modules
│   │   ├── 📂 auth/             # Authentication
│   │   ├── 📂 dashboard/        # Dashboard
│   │   └── 📂 videos/           # Video management
│   ├── 📂 hooks/                # Custom hooks
│   ├── 📂 lib/                  # Libraries & utils
│   │   ├── 📂 db/               # Database (Drizzle)
│   │   ├── 📂 supabase/         # Supabase client
│   │   └── 📂 utils/            # Helper functions
│   └── 📂 types/                # TypeScript types
├── 📂 supabase/                 # Supabase config
├── 📄 .env.local                # Environment variables
├── 📄 drizzle.config.ts         # Drizzle configuration
├── 📄 next.config.ts            # Next.js configuration
├── 📄 tailwind.config.ts        # Tailwind configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 package.json              # Dependencies
```

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón!  Hãy follow các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Quy Tắc Đóng Góp

- Viết code clean và có comment
- Follow coding conventions hiện tại
- Viết commit messages rõ ràng
- Cập nhật documentation nếu cần
- Thêm tests cho features mới

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Tác Giả

**Phan Nhật Tiến**

- GitHub: [@PhanNhatTien090](https://github.com/PhanNhatTien090)
- Project Link: [https://github.com/PhanNhatTien090/Viral-shorts](https://github.com/PhanNhatTien090/Viral-shorts)
- Live Demo: [https://viral-short.vercel.app/](https://viral-short.vercel.app/)

---

## 🙏 Cảm Ơn

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/)
- [Clerk](https://clerk.com/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

<div align="center">
  
  **⭐ Nếu project này hữu ích, hãy star repo để ủng hộ nhé!  ⭐**

  Made with ❤️ by [PhanNhatTien090](https://github.com/PhanNhatTien090)

</div>
