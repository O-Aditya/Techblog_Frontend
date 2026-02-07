# Techblog Frontend 🚀

![AstroPaper Theme](https://github.com/satnaing/astro-paper/raw/main/public/astropaper-og.jpg)
*(Note: Design inspired by [AstroPaper](https://github.com/satnaing/astro-paper))*

A modern, responsive personal blog frontend built with **React**, **Vite**, and **TypeScript**. This project features a custom implementation of the beautiful "AstroPaper" theme, fully integrated with a Spring Boot backend.

## ✨ Key Features

### 🎨 Design & UX
- **AstroPaper Aesthetic**: A pixel-perfect recreation of the minimalist AstroPaper theme.
- **Dark/Light Mode**: Seamless theme switching with system preference detection.
- **Responsive Layout**: Mobile-first design that looks great on all devices.
- **Typography**: Uses **JetBrains Mono** for code blocks and **Inter/Outfit** for UI elements.
- **Code Highlighting**: Beautifully styled code blocks for technical content.

### 🛠️ Functionality
- **Markdown Rendering**: Write posts in Markdown; view them as rich HTML.
- **Authentication**: JWT-based login system for Admin access.
- **Draft System**: Create and edit drafts before publishing.
- **Tagging & Categories**: Organize content with a robust tagging system.
- **Search & Filter**: Filter posts by tags or categories instantly.
- **Pagination**: Efficiently browse through large numbers of posts.
- **Reading Time**: Automatic reading time calculation for every post.

### ⚡ Tech Stack
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Axios

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/O-Aditya/Techblog_Frontend.git
cd Techblog_Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory (optional for local dev, defaults to localhost):
```env
# URL of your Spring Boot Backend
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 📦 Deployment (Vercel / Netlify / Render)

This project is optimized for static hosting.

1.  **Build Command**: `npm run build`
2.  **Output Directory**: `dist`
3.  **Environment Variables**:
    Set `VITE_API_BASE_URL` to your production backend URL (e.g., on Render).

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (NavBar, PostCard, etc.)
├── context/          # Global state (Theme, Auth)
├── pages/            # Route pages (Home, Post, Login, etc.)
├── services/         # API integration (Axios setup)
├── assets/           # Static assets (Images, SVGs)
└── App.tsx           # Main application entry
```

## 🔒 Admin Features
- access `/login` to sign in.
- Once logged in, you can **Create**, **Edit**, and **Delete** posts.
- Manage **Drafts** via the specific Drafts view.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
