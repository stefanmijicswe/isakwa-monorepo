# Infrastructure

Docker and Kubernetes deployment configurations for GCP.

## Structure

```
infra/
├── docker/           # Docker configurations
├── kubernetes/       # K8s manifests
├── terraform/        # GCP infrastructure as code
└── scripts/          # Deployment scripts
```

## Deployment Target

- **Cloud Provider**: Google Cloud Platform (GCP)
- **Container Registry**: GCP Container Registry
- **Orchestration**: Google Kubernetes Engine (GKE)
- **Database**: Cloud SQL (PostgreSQL)

## Services

- **Frontend**: Next.js client app
- **Backend**: NestJS API server
- **Database**: PostgreSQL
- **Cache**: Redis (future)
- **Storage**: Cloud Storage (future)