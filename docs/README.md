# Project Management App - Quick Start Guide

## 🚀 Bắt đầu nhanh

### Bước 1: Tạo project mới với Vite

```bash
npm create vite@latest project-management -- --template react
cd project-management
```

### Bước 2: Copy file package.json đã chuẩn bị

Thay thế nội dung file `package.json` trong project bằng nội dung từ file `package.json` đã cung cấp.

### Bước 3: Cài đặt dependencies

```bash
npm install
```

### Bước 4: Cấu hình Tailwind CSS

#### 4.1. Khởi tạo Tailwind
```bash
npx tailwindcss init -p
```

#### 4.2. Cập nhật file `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

#### 4.3. Cập nhật file `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

### Bước 5: Tạo cấu trúc thư mục

```bash
mkdir -p src/{components/{common,workspace,project,task,user,analytics},features/{workspace,project,task,user},hooks,layouts,pages,services,store,utils}
```

### Bước 6: Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 📂 Cấu trúc thư mục

```
src/
├── assets/              # Hình ảnh, icons, fonts
├── components/          # React components
│   ├── common/         # Shared components (Button, Input, Card, Modal, etc.)
│   ├── workspace/      # Workspace components
│   ├── project/        # Project components
│   ├── task/           # Task components
│   ├── user/           # User components
│   └── analytics/      # Analytics components
├── features/           # Redux slices
│   ├── workspace/      # workspaceSlice.js
│   ├── project/        # projectSlice.js
│   ├── task/           # taskSlice.js
│   └── user/           # userSlice.js
├── hooks/              # Custom React hooks
├── layouts/            # Layout components (MainLayout.jsx)
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── WorkspacePage.jsx
│   ├── ProjectPage.jsx
│   ├── TaskPage.jsx
│   ├── AnalyticsPage.jsx
│   └── TeamPage.jsx
├── services/           # API services
├── store/              # Redux store configuration
│   └── index.js
├── utils/              # Utility functions
│   ├── localStorage.js
│   └── sampleData.js
├── App.jsx
└── main.jsx
```

---

## 🎯 Thứ tự phát triển (theo kế hoạch chi tiết)

### Tuần 1 (Ngày 1-5): Foundation
1. ✅ Setup project & dependencies
2. ✅ Cấu hình Tailwind CSS
3. ✅ Tạo Redux store & slices
4. ✅ Xây dựng common components

### Tuần 2 (Ngày 6-10): Core Features
5. ✅ Xây dựng Workspace module
6. ✅ Xây dựng Project module
7. ✅ Xây dựng Task module (Kanban board)

### Tuần 3 (Ngày 11-15): UI & Analytics
8. ✅ Analytics dashboard & charts
9. ✅ Pages & Routing
10. ✅ Main layout & navigation

### Tuần 4 (Ngày 16-20): Polish & Deploy
11. ✅ LocalStorage integration
12. ✅ Testing & optimization
13. ✅ Build & deployment

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

---

## 📝 Tính năng chính

### ✨ Workspaces
- Tạo và quản lý nhiều workspace
- Mỗi workspace có projects và members riêng
- Switch giữa các workspace

### 📁 Projects
- Tạo và quản lý projects
- Theo dõi tiến độ với completion rate
- Set deadline và status
- Analytics cho từng project

### ✅ Tasks
- Kanban board (To Do, In Progress, Done)
- Drag & drop tasks (có thể mở rộng)
- Priority levels (Low, Medium, High)
- Due dates
- Assign tasks to members

### 📊 Analytics
- Project progress tracking
- Task completion rates
- Team size metrics
- Visual charts với Recharts

### 👥 Team Management
- Invite team members
- Manage roles
- View user activity

---

## 🎨 UI Components Library

### Common Components đã có
- `Button` - Multiple variants (primary, secondary, danger, success, outline)
- `Input` - With label, error handling
- `Card` - Container với title và actions
- `Modal` - Flexible modal với header, body, footer
- `Dropdown` - Custom dropdown select
- `Badge` - Status badges

---

## 💾 Data Persistence

Ứng dụng sử dụng **LocalStorage** để lưu trữ data:
- Workspaces
- Projects
- Tasks
- Users
- Current workspace

Data sẽ tự động save khi có thay đổi và load khi app khởi động.

---

## 🚀 Build & Deploy

### Build cho production
```bash
npm run build
```

### Preview build locally
```bash
npm run preview
```

### Deploy lên Vercel
```bash
npm install -g vercel
vercel
```

### Deploy lên Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📖 Hướng dẫn sử dụng

1. **Tạo Workspace đầu tiên**
   - Click "New Workspace" trên trang Workspaces
   - Nhập tên và mô tả
   - Click "Create Workspace"

2. **Tạo Project**
   - Select workspace
   - Navigate to Projects page
   - Click "New Project"
   - Fill in project details
   - Set status và deadline

3. **Tạo Tasks**
   - Navigate to Tasks page
   - Click "New Task"
   - Set title, description, priority
   - Choose status (To Do, In Progress, Done)
   - Set due date

4. **View Analytics**
   - Navigate to Analytics page
   - Xem tổng quan về projects
   - Charts về task status và project progress

---

## 🔧 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port trong vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Dependencies lỗi
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tài liệu tham khảo

- [Kế hoạch chi tiết](./KE_HOACH_XAY_DUNG_PROJECT_MANAGEMENT.md) - Hướng dẫn từng bước A-Z
- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

---

## 🤝 Contributing

Đóng góp cho project theo các bước:
1. Fork repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - xem file LICENSE.md

---

## 💬 Support

Nếu có vấn đề hoặc câu hỏi:
- Tham khảo file kế hoạch chi tiết
- Check documentation
- Tạo issue trên GitHub

---

**Happy Coding! 🎉**
---

## Current Progress Snapshot

- [x] Phase 1: Setup & Configuration - Vite scaffold, Tailwind baseline, initial layout folders
- [ ] Phase 2: Redux Store Setup - core slices and typed hooks
- [ ] Phase 3: Common Components - button, input, modal, card, dropdown, badge
- [ ] Phase 4+: Workspace, Project, Task, Analytics modules and routing

---

## Phase 1 Deliverables (Completed)

- Vite + React app bootstrap (`index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`)
- Tailwind CSS + PostCSS configuration (`tailwind.config.js`, `postcss.config.js`, `src/index.css`)
- Baseline project structure with placeholders for features, pages, services, store, and utilities
- `.gitignore` rules covering node modules, build artifacts, and environment files

> Verify the setup by running `npm install` followed by `npm run dev`, then visit `http://localhost:5173` to confirm the starter screen renders.

---

## Upcoming Focus

1. Configure Redux store scaffolding (`src/store`, feature slices, typed hooks)
2. Build reusable UI components per design system guidelines
3. Implement workspace/project/task modules incrementally with mock data
4. Add analytics visualizations and complete routing shell

---
