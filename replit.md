# SocialConnect - Replit Project Guide

## Overview

SocialConnect is a full-stack social media application built with React frontend and Express.js backend. The application allows users to create posts, like content, and comment on posts in a Twitter/Instagram-like interface. It uses PostgreSQL with Drizzle ORM for data persistence and integrates with Replit's authentication system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit's OpenID Connect authentication system
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with JSON responses

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Type-safe schema definitions with Zod validation
- **Relations**: User posts, likes, and comments with proper foreign keys
- **Session Storage**: Built-in session table for Replit Auth compatibility

## Key Components

### Authentication System
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation/updates from Replit profile data
- **Security**: HTTP-only cookies with secure session configuration

### Data Models
- **Users**: Profile information from Replit (email, name, avatar)
- **Posts**: Text content with optional images and timestamps
- **Likes**: User-post relationships for engagement tracking
- **Comments**: Threaded comments on posts with author information
- **Sessions**: Secure session storage (required for Replit Auth)

### API Endpoints
- `GET /api/auth/user` - Get current user profile
- `GET /api/posts` - Fetch all posts with author information
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post details
- `POST /api/posts/:id/like` - Toggle post like status
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Create new comment

### Frontend Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time Updates**: Optimistic updates with TanStack Query
- **Component Library**: Reusable UI components with consistent styling
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

1. **Authentication Flow**:
   - User visits application
   - Redirected to Replit OAuth if not authenticated
   - User profile stored/updated in PostgreSQL
   - Session established with secure cookies

2. **Post Creation Flow**:
   - User submits post form
   - Client validates input with Zod schema
   - API creates post with user association
   - Real-time UI update with optimistic response
   - Query cache invalidation for fresh data

3. **Interaction Flow**:
   - User likes/comments on posts
   - Immediate UI feedback with optimistic updates
   - Background API calls update database
   - Error handling with rollback on failure

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **react**: Frontend UI library
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS utilities
- **lucide-react**: Icon library

### Development Dependencies
- **typescript**: Static type checking
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database migration tools

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID
- **Build Process**: Concurrent frontend and backend development

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Static Assets**: Served by Express in production
- **Database Migrations**: Drizzle Kit push command

### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable
- **Authentication**: Requires Replit domain and OAuth configuration
- **Sessions**: Requires SESSION_SECRET for secure cookies
- **Build**: Automatic detection of production vs development mode

## Changelog

```
Changelog:
- July 05, 2025. Initial setup with Replit Auth, PostgreSQL, and full social media features
- July 05, 2025. Added comprehensive local development setup guides and documentation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```