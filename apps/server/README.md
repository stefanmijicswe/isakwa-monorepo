# IsaKwa Server

NestJS backend server for the IsaKwa application.

## Description

This is the backend API server built with NestJS framework, providing RESTful endpoints for the IsaKwa application.

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## API Endpoints

- `GET /api` - Welcome message
- `GET /api/health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3001)

## Development

This server is part of a Turborepo monorepo. You can run it alongside the client application using:

```bash
# From the root directory
yarn dev
```

This will start both the client (port 3000) and server (port 3001) in development mode.
