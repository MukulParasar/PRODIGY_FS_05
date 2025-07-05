# SocialConnect - Complete Installation Guide

## Step-by-Step Setup for Local Development

### 1. System Requirements
- Node.js 18+ (download from nodejs.org)
- PostgreSQL 12+ (download from postgresql.org)
- Git

### 2. Get the Project Files
```bash
# Clone the repository
git clone <your-repo-url>
cd socialconnect

# Install all dependencies
npm install
```

### 3. Database Setup

#### Easy Option: Using Docker
```bash
# Run PostgreSQL in a container
docker run --name socialconnect-db \
  -e POSTGRES_DB=socialconnect \
  -e POSTGRES_USER=socialconnect_user \
  -e POSTGRES_PASSWORD=mypassword123 \
  -p 5432:5432 \
  -d postgres:14

# Wait a few seconds for the database to start
sleep 5
```

#### Manual Option: Local PostgreSQL
1. Install PostgreSQL on your system
2. Start the PostgreSQL service
3. Create database:
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE socialconnect;
CREATE USER socialconnect_user WITH PASSWORD 'mypassword123';
GRANT ALL PRIVILEGES ON DATABASE socialconnect TO socialconnect_user;
\q
```

### 4. Environment Configuration
Create a `.env` file in your project root:
```env
# Copy this exactly:
DATABASE_URL=postgresql://socialconnect_user:mypassword123@localhost:5432/socialconnect
SESSION_SECRET=super-secret-key-for-sessions-development-12345
REPL_ID=your-repl-id-from-replit
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
NODE_ENV=development
```

### 5. Initialize Database Schema
```bash
npm run db:push
```

### 6. Start the Application
```bash
npm run dev
```

Your app will be running at: `http://localhost:5000`

## Testing the Setup

1. Visit `http://localhost:5000`
2. You should see a landing page
3. Click "Sign In" to test authentication
4. Try creating posts and interacting with the feed

## Common Issues & Solutions

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Docker: docker ps
# Local: sudo systemctl status postgresql

# Test database connection
psql -U socialconnect_user -d socialconnect -h localhost
```

### Port 5000 Already in Use
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill

# Or change the port in server/index.ts
```

### Authentication Issues
- Make sure your `REPL_ID` is correct from your Replit project
- Verify `REPLIT_DOMAINS` includes `localhost:5000`
- Check that `SESSION_SECRET` is set

### Dependencies Issues
```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install
```

## Project Structure Overview
```
socialconnect/
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types/schemas
├── package.json      # Dependencies & scripts
└── .env             # Environment variables
```

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Update database schema

That's it! You now have a fully functional social media application running locally.