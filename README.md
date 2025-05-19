# Travel Article App 🌍

A modern web application built for the Datacakra Frontend Engineer Internship Assessment. This platform provides a seamless experience for users to explore, create, and manage travel articles with a beautiful and responsive interface.

The application will be available at `https://travel-article-app-xi.vercel.app/`

## ✨ Features

- 🔐 **Authentication System**

  - Secure login and registration
  - Protected routes
  - Persistent sessions

- 📝 **Article Management**

  - Create, read, update, and delete articles
  - Rich text editing
  - Image upload support
  - Infinite scroll for article list

- 🎨 **Modern UI/UX**

  - Responsive design for all devices
  - Beautiful and intuitive interface
  - Loading states and animations
  - Error handling with user feedback

## 🛠️ Tech Stack

### Frontend

- **Framework**: ReactJS with TypeScript
- **Styling**:
  - TailwindCSS
  - Shadcn/UI
- **State Management**: Zustand for global state
- **Form Handling**:
  - Zod for schema validation
  - React Hook Form for form management
- **Data Fetching**:
  - Axios for HTTP requests
  - TanStack React Query for data caching and state management
- **Routing**: React Router DOM
- **Typography**: Google Fonts (Poppins)

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   └── article/        # Article-related components
├── pages/              # Page components
├── lib/                # API utilities and configurations
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/travel-article-app.git
```

2. Navigate to the project directory:

```bash
cd travel-article-app
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```
