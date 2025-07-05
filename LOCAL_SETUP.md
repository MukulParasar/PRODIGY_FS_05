# Quick Local Setup Guide

Follow these steps to run SocialConnect on your local machine:

## Step 1: Prerequisites
Install these on your computer:
- Node.js 18+ (download from nodejs.org)
- PostgreSQL (download from postgresql.org)
- Git

## Step 2: Get the Code
```bash
# Clone your project
git clone <your-repository-url>
cd socialconnect

# Install dependencies
npm install
```

## Step 3: Database Setup

### Option 1: Local PostgreSQL
1. Install and start PostgreSQL on your system
2. Create a database:
```bash
# Open PostgreSQL terminal
psql -U postgres

# Create database and user
CREATE DATABASE socialconnect;
CREATE USER socialconnect_user WITH PASSWORD 'mypassword123';
GRANT ALL PRIVILEGES ON DATABASE socialconnect TO socialconnect_user;
\q
```

### Option 2: Docker (Easier)
```bash
docker run --name socialconnect-db \
  -e POSTGRES_DB=socialconnect \
  -e POSTGRES_USER=socialconnect_user \
  -e POSTGRES_PASSWORD=mypassword123 \
  -p 5432:5432 \
  -d postgres:14
```

## Step 4: Environment Setup
Create a `.env` file in your project root:
```
DATABASE_URL=postgresql://socialconnect_user:mypassword123@localhost:5432/socialconnect
SESSION_SECRET=my-super-secret-key-for-sessions-12345
REPL_ID=your-repl-id-from-replit
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
NODE_ENV=development
```

## Step 5: Set up Database Tables
```bash
npm run db:push
```

## Step 6: Start the App
```bash
npm run dev
```

Visit `http://localhost:5000` in your browser!

## Need Help?

### Database Issues
- Make sure PostgreSQL is running
- Check your DATABASE_URL is correct
- Try: `psql -U socialconnect_user -d socialconnect` to test connection

### Authentication Issues
- Get your REPL_ID from your Replit project settings
- Make sure REPLIT_DOMAINS includes `localhost:5000`

### Port Issues
- If port 5000 is busy, kill the process: `lsof -ti:5000 | xargs kill`
- Or change the port in server/index.ts

That's it! You should now have a fully working social media app running locally.