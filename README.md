# SocialConnect - Local Setup Guide

A full-stack social media application built with React, Express.js, and PostgreSQL.

## Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 12 or higher)
- **Git** (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd socialconnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL Installation

1. Install PostgreSQL on your system:
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql` or download from postgresql.org
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. Start PostgreSQL service:
   - **Windows**: Use Services or run `net start postgresql-x64-14`
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

3. Create a database:
```bash
# Access PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE socialconnect;
CREATE USER socialconnect_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE socialconnect TO socialconnect_user;
\q
```

#### Option B: Using Docker (Alternative)

```bash
# Run PostgreSQL in Docker
docker run --name socialconnect-db \
  -e POSTGRES_DB=socialconnect \
  -e POSTGRES_USER=socialconnect_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://socialconnect_user:your_password@localhost:5432/socialconnect

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Replit Auth Configuration (for local development)
REPL_ID=your-repl-id
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc

# Development Environment
NODE_ENV=development
```

### 5. Database Schema Setup

Push the database schema to your PostgreSQL instance:

```bash
npm run db:push
```

### 6. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
socialconnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── replitAuth.ts     # Authentication logic
├── shared/               # Shared types and schemas
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio (if available)

## Authentication Setup

For local development, you'll need to configure Replit Auth:

1. Go to your Replit project
2. Navigate to Secrets tab
3. Add the following secrets:
   - `SESSION_SECRET`: A random string for session encryption
   - `REPLIT_DOMAINS`: `localhost:5000` (for local development)

## Features

- ✅ User authentication via Replit Auth
- ✅ Create and view posts
- ✅ Like and comment on posts
- ✅ Real-time feed updates
- ✅ Responsive design
- ✅ Mobile-friendly interface

## Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication data
- **posts**: User posts with content and metadata
- **likes**: Post likes tracking
- **comments**: Post comments with user associations
- **sessions**: Session storage for authentication

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in .env file
   - Verify database credentials

2. **Authentication Not Working**
   - Check REPLIT_DOMAINS includes your local domain
   - Ensure SESSION_SECRET is set
   - Verify REPL_ID is correct

3. **Port Already in Use**
   - Change the port in server/index.ts
   - Or stop the process using the port: `lsof -ti:5000 | xargs kill`

4. **Dependencies Issues**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

### Development Tips

- Use `npm run db:push` after making schema changes
- Check browser console for frontend errors
- Check terminal for backend errors
- Use PostgreSQL logs for database issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.