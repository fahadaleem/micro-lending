# MongoDB Setup for Micro Lending App

## Prerequisites

- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

## Option 1: Local MongoDB

1. **Install MongoDB** (if not already installed):

   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: Follow [official docs](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**:

   ```bash
   # Windows (as service)
   net start MongoDB

   # Mac/Linux
   brew services start mongodb-community
   # OR
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

## Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `server/.env` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micro-lending?retryWrites=true&w=majority
   ```

## Setup Steps

1. **Install dependencies** (if not done):

   ```bash
   cd server
   npm install
   ```

2. **Configure environment**:

   - The `.env` file is already created with default local MongoDB settings
   - Update if using MongoDB Atlas

3. **Seed the database** with sample data:

   ```bash
   npm run seed
   ```

   This creates:

   - 1 test user (username: `admin`, password: `password123`)
   - 20 sample invoices

4. **Start the server**:
   ```bash
   npm run dev
   ```

## Database Structure

### Users Collection

- username (unique, required)
- password (hashed, required)
- email (optional)
- role (finance_manager | admin)
- timestamps (createdAt, updatedAt)

### Invoices Collection

- identifier (unique, required)
- customer_name, company, email, phone
- amount_due (number, required)
- payment_status (pending | paid | overdue)
- invoice_date, due_date, payment_date
- reference, billing_address, notes_to_customer
- created_by (ref to User)
- payment_link_token, payment_link_expires_at, payment_link_used_at
- timestamps (createdAt, updatedAt)

## Test Credentials

After seeding:

- **Username**: admin
- **Password**: password123

## Troubleshooting

### Connection errors

- Ensure MongoDB is running (`mongosh` to test)
- Check `.env` MONGODB_URI is correct
- For Atlas: Whitelist your IP in Network Access

### Seed errors

- Drop existing database if needed:
  ```bash
  mongosh
  > use micro-lending
  > db.dropDatabase()
  ```
- Run seed again: `npm run seed`

## MongoDB GUI Tools (Optional)

- [MongoDB Compass](https://www.mongodb.com/products/compass) - Official GUI
- [Studio 3T](https://studio3t.com/) - Advanced features
- [Robo 3T](https://robomongo.org/) - Lightweight

Connect to `mongodb://localhost:27017` to browse your data.
