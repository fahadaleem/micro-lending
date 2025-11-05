# Micro Lending - Server Application

A robust REST API backend for the Micro Lending invoice management system. Built with Node.js, Express, and MongoDB, this server provides secure authentication, invoice management, and payment processing capabilities.

## 🚀 Features

### Authentication & Authorization

- ✅ **JWT-based Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt encryption for password security
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Email-based Login** - User authentication via email and password
- ✅ **Token Verification** - Automatic token validation and user verification

### Invoice Management

- ✅ **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- ✅ **Server-side Pagination** - Efficient data pagination with customizable limits
- ✅ **Advanced Filtering** - Multi-field filtering with various operators
- ✅ **Flexible Sorting** - Sort by any field in ascending/descending order
- ✅ **Status Management** - Track invoice status (pending, paid, overdue)
- ✅ **Search Functionality** - Text-based search across invoice fields

### Payment Processing

- ✅ **Payment Link Generation** - Create secure, tokenized payment links
- ✅ **Link Expiration** - Automatic 7-day expiry for payment links
- ✅ **Usage Tracking** - Monitor payment link usage and prevent reuse
- ✅ **Public Payment Endpoints** - No authentication required for payment pages
- ✅ **Payment Confirmation** - Mark invoices as paid via token

### Data Management

- ✅ **MongoDB Integration** - NoSQL database for flexible data storage
- ✅ **Mongoose ODM** - Schema validation and data modeling
- ✅ **Data Seeding** - Automated seed script for development data
- ✅ **Relationship Management** - User-invoice relationships with references

### API Features

- ✅ **CORS Support** - Cross-Origin Resource Sharing enabled
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Async Error Wrapper** - Clean async/await error management
- ✅ **RESTful Design** - Standard REST API conventions
- ✅ **JSON Responses** - Consistent JSON response format

## 📁 Folder Structure

```
server/
├── config/                    # Configuration files
│   └── database.js           # MongoDB connection configuration
│
├── controllers/              # Request handlers (business logic)
│   ├── authController.js    # Authentication logic (register, login, verify)
│   └── invoiceController.js # Invoice operations (CRUD, filtering, payment links)
│
├── routes/                   # API route definitions
│   ├── authRoutes.js        # Authentication routes (/api/auth/*)
│   ├── invoiceRoutes.js     # Invoice routes (/api/invoices/*)
│   └── paymentRoutes.js     # Public payment routes (/api/payment/*)
│
├── schema/                   # Mongoose schemas and models
│   ├── Invoice.js           # Invoice model with validation
│   └── User.js              # User model with authentication fields
│
├── utils/                    # Utility functions and helpers
│   ├── authMiddleware.js    # JWT verification middleware
│   ├── errorMiddleware.js   # Error handling utilities
│   └── seed.js              # Database seeding script
│
├── .env                      # Environment variables (not in repo)
├── .gitignore               # Git ignore rules
├── index.js                 # Application entry point
├── MONGODB_SETUP.md         # MongoDB setup instructions
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express 5.1** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.19** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-restart

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd micro-lending-app-3/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server root directory:

```bash
touch .env
```

Add the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/micro-lending

# Option 2: MongoDB Atlas (Cloud) - Replace with your connection string
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/micro-lending?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration (optional)
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database

Populate the database with initial data (admin user + sample invoices):

```bash
npm run seed
```

This creates:

- **Admin User**: `admin@example.com` / `password123`
- **20 Sample Invoices** with various statuses

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:3000`

## 📜 Available Scripts

| Script         | Description                                   |
| -------------- | --------------------------------------------- |
| `npm run dev`  | Start server in development mode with nodemon |
| `npm start`    | Start server in production mode               |
| `npm run seed` | Seed database with initial data               |

## 🔐 Authentication

### JWT Token Flow

1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token (7-day expiry)
4. Client stores token and includes in subsequent requests
5. Server validates token on protected routes

### Protected Routes

All routes except authentication and public payment routes require JWT token:

```bash
Authorization: Bearer <token>
```

## 🛣️ API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Register new user | No            |
| POST   | `/login`    | Login user        | No            |
| GET    | `/verify`   | Verify JWT token  | Yes           |
| POST   | `/logout`   | Logout user       | Yes           |

### Invoice Routes (`/api/invoices`)

| Method | Endpoint                     | Description                                  | Auth Required |
| ------ | ---------------------------- | -------------------------------------------- | ------------- |
| GET    | `/`                          | Get all invoices (with pagination/filtering) | Yes           |
| GET    | `/:id`                       | Get single invoice by ID                     | Yes           |
| POST   | `/`                          | Create new invoice                           | Yes           |
| PUT    | `/:id`                       | Update invoice                               | Yes           |
| DELETE | `/:id`                       | Delete invoice                               | Yes           |
| PATCH  | `/:id/mark-paid`             | Mark invoice as paid                         | Yes           |
| POST   | `/:id/generate-payment-link` | Generate payment link                        | Yes           |

### Payment Routes (`/api/payment`)

| Method | Endpoint          | Description                  | Auth Required |
| ------ | ----------------- | ---------------------------- | ------------- |
| GET    | `/invoice/:token` | Get invoice by payment token | No            |
| POST   | `/pay/:token`     | Process payment via token    | No            |
