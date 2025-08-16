# ISA KWA Server

NestJS backend for university LMS system.

## Setup

```bash
# Install dependencies
yarn install

# Set environment variables
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
echo 'JWT_SECRET="dev-secret-key"' >> .env

# Generate database
yarn prisma generate
yarn prisma db push

# Start server
yarn start:dev
```

Server runs on `http://localhost:3001`

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get current user profile
- `GET /api/test/*` - Test endpoints for different roles

## Stack

- NestJS
- Prisma ORM
- SQLite
- JWT Auth
- TypeScript