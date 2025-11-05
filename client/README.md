# Micro Lending - Client Application

A modern, responsive invoice management system built with React, designed for micro-lending operations. This application provides a comprehensive solution for creating, managing, and tracking invoices with integrated payment link generation.

## 🚀 Features

### Invoice Management

- ✅ **Create Invoices** - Generate detailed invoices with customer information, billing details, and payment terms
- ✅ **View & Filter Invoices** - Browse invoices with advanced filtering capabilities (by date, amount, status, customer)
- ✅ **Search Functionality** - Quick search across invoice numbers and customer names
- ✅ **Sorting & Pagination** - Server-side sorting and pagination for efficient data handling
- ✅ **Update Invoice Status** - Mark invoices as paid with a single click
- ✅ **Delete Invoices** - Remove invoices with confirmation dialog

### Payment Processing

- ✅ **Generate Payment Links** - Create tokenized, secure payment links for customers
- ✅ **Public Payment Page** - Customers can view and pay invoices via shared links
- ✅ **Payment Link Management** - Track link expiry and usage
- ✅ **Payment Status Tracking** - Monitor invoice status (Pending, Paid, Overdue)

### User Experience

- ✅ **Authentication** - Secure email-based login with JWT tokens
- ✅ **Protected Routes** - Automatic redirection for unauthenticated users
- ✅ **Toast Notifications** - Real-time feedback for user actions
- ✅ **Form Validation** - Comprehensive validation using Zod schemas
- ✅ **Responsive Design** - Mobile-first design with desktop optimization
- ✅ **Dynamic Header** - Context-aware header with action buttons

### Technical Features

- ✅ **Server-Side Operations** - All filtering, sorting, and pagination handled by backend
- ✅ **State Management** - Redux for global authentication state
- ✅ **Context API** - Header context for dynamic page configurations
- ✅ **Type-Safe Forms** - React Hook Form with Zod validation
- ✅ **Modern UI Components** - Shadcn/UI component library
- ✅ **Date Handling** - Robust date validation and formatting

## 📁 Folder Structure

```
client/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, icons, and static files
│   │   └── react.svg
│   │
│   ├── components/            # React components organized by purpose
│   │   ├── common/           # Shared reusable components
│   │   │   ├── ConfirmationModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── form/             # Reusable form field components
│   │   │   ├── DateField.jsx
│   │   │   ├── NumberField.jsx
│   │   │   ├── SelectField.jsx
│   │   │   └── TextField.jsx
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── FinanceManagerLayout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── ui/               # Shadcn/UI components
│   │   │   ├── alert.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── calendar.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── drawer.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── popover.jsx
│   │   │   ├── scroll-area.jsx
│   │   │   ├── select.jsx
│   │   │   ├── table.jsx
│   │   │   ├── textarea.jsx
│   │   │   └── tooltip.jsx
│   │   │
│   │   └── finance-manager/  # Feature-specific components
│   │       ├── dashboard/
│   │       │   ├── Dashboard.jsx
│   │       │   ├── DataTable.jsx
│   │       │   ├── Filters.jsx
│   │       │   ├── InvoiceActionDropdown.jsx
│   │       │   └── SearchField.jsx
│   │       └── create-invoice/
│   │           └── CreateInvoice.jsx
│   │
│   ├── contexts/             # React Context providers
│   │   └── HeaderContext.jsx
│   │
│   ├── lib/                  # Utilities and helpers
│   │   ├── appConstants.js   # Application constants and configurations
│   │   ├── utils.js          # Utility functions
│   │   └── validation.js     # Zod validation schemas
│   │
│   ├── pages/                # Page components
│   │   ├── CreateInvoicePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── PayInvoice.jsx
│   │
│   ├── services/             # API services
│   │   └── api/
│   │       ├── apiClient.js
│   │       ├── authApi.js
│   │       ├── index.js
│   │       ├── invoicesApi.js
│   │       ├── mockApiClient.js
│   │       └── mockData.js
│   │
│   ├── store/                # Redux store
│   │   ├── authSlice.js
│   │   └── index.js
│   │
│   ├── App.jsx               # Root component with routing
│   ├── App.css               # Application styles
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles (Tailwind CSS)
│
├── .env                      # Environment variables
├── .env.example              # Environment variables template
├── components.json           # Shadcn/UI configuration
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── jsconfig.json             # JavaScript configuration
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🛠️ Technology Stack

- **React 19.1** - UI library
- **Vite 7** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/UI** - Component library
- **Axios** - HTTP client
- **Date-fns** - Date manipulation
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see server README)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd micro-lending-app-3/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the client root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## 📜 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

## 🔐 Authentication

### Default Credentials

For development, use these credentials:

- **Email**: `admin@example.com`
- **Password**: `password123`

> ⚠️ Make sure the backend server is running and seeded with initial data.

## 🧭 Application Routes

| Route              | Description                 | Access    |
| ------------------ | --------------------------- | --------- |
| `/login`           | Login page                  | Public    |
| `/`                | Dashboard with invoice list | Protected |
| `/invoices/create` | Create new invoice          | Protected |
| `/pay/:token`      | Public payment page         | Public    |

## 🎨 UI Components

The application uses **Shadcn/UI** components, which are:

- Built on Radix UI primitives
- Fully customizable with Tailwind CSS
- Accessible by default
- Located in `src/components/ui/`

## 📊 State Management

### Redux Store

- **Auth Slice**: User authentication state
- Persisted to localStorage
- Automatic rehydration on app load

### Context API

- **HeaderContext**: Dynamic header configuration
- Allows pages to customize header title and actions

## 🔍 Key Features Implementation

### Invoice Filtering

```javascript
// Supports multiple filter types
- Text filters (contains, equals, starts with, ends with)
- Number filters (equals, greater than, less than)
- Date filters (on, before, after)
- Select filters (payment status)
```

### Payment Link Generation

```javascript
// Tokenized secure links
- 7-day expiration
- One-time use tracking
- Public access without authentication
```

**Built with ❤️ using React + Vite + Tailwind CSS**
