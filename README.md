# Nexus SaaS Dashboard

A production-grade, feature-rich SaaS dashboard built with **React**, **Vite**, and **TypeScript**. This project demonstrates advanced frontend architecture, mocked data layers, and premium UI/UX design.

## 🚀 Key Features

- **Campaign Management**: Full CRUD-like simulation with sorting, multi-filter, debounced search, and pagination.
- **Job Simulation Engine**: A state-driven async lifecycle engine (Pending → Processing → Completed/Failed) with polling behavior.
- **Data Layer Architecture**: Abstracted service layer with simulated latency, optimistic UI updates, and localStorage persistence.
- **Premium UI/UX**: Built with Tailwind CSS, Lucide icons, and Recharts, featuring glassmorphism, smooth animations, and responsive layouts.
- **Feature-Based Architecture**: Scalable folder structure following industry best practices.

## 🛠 Tech Stack

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Navigation**: [React Router 6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📂 Architecture

The project follows a **Feature-Based Folder Structure**:

```text
src/
├── components/     # Shared UI components (Button, Input, etc.)
├── features/       # Feature-specific logic & components
│   ├── campaigns/  # Campaign table, cards, forms
│   └── jobs/       # Job progress, status indicators
├── services/       # Mocked API layer & business logic
├── types/          # Global TypeScript interfaces
├── utils/          # Formatting & helper functions
├── layouts/        # Page layouts (Sidebar, Header)
└── pages/          # Main route components
```

## 🏗 Data Simulation Design

The `MockApiService` simulates a real backend environment:
- **Async Delays**: Every "request" has a 800ms - 1500ms artificial delay to test loading states.
- **Persistence**: Data is persisted in `localStorage` to maintain state across browser refreshes.
- **Job Engine**: Jobs run in the background with randomized outcomes and progress increments, demonstrating polling and real-time UI updates.

## ⚡ Performance Considerations

- **Optimistic UI**: Status toggles and minor updates happen instantly in the UI while the "API call" resolves in the background.
- **Memoization**: Key components and callbacks are memoized using `useCallback` and `useEffect` dependencies.
- **Lazy Loading**: (Optional) Routes can be lazy-loaded for faster initial bundle delivery.

## 🏃 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build for production: `npm run build`
