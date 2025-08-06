# Services

This directory contains backend microservices for the Isakwa application.

## Planned Services

- `auth-service` - Authentication and authorization
- `user-service` - User management
- `notification-service` - Email/SMS notifications
- `api-gateway` - API Gateway for routing requests

## Development

Each service will have its own:
- `package.json` with dependencies
- TypeScript configuration
- Docker configuration
- Unit and integration tests

## Getting Started

```bash
# Create a new service
mkdir services/my-service
cd services/my-service
yarn init
```

## Architecture

Services will communicate via:
- REST APIs
- Message queues (future)
- Shared database schemas
- Event-driven architecture 