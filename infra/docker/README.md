# Docker Infrastructure

This directory contains Docker configurations for the ISAKWA project infrastructure.

## Services

### Apache Jena Fuseki (TDB2)

- **Image**: `starthought/fuseki:latest`
- **Port**: `3030`
- **Purpose**: RDF triple store for Universities data
- **Web UI**: http://localhost:3030
- **Dataset**: `universities`

## Quick Start

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Start services:**
   ```bash
   # From project root
   cd infra/docker
   docker-compose up -d
   ```

3. **Verify Fuseki is running:**
   ```bash
   curl http://localhost:3030/$/ping
   ```

4. **Access Fuseki Web UI:**
   Open http://localhost:3030 in your browser
   - Username: `admin`
   - Password: `admin123` (or your FUSEKI_ADMIN_PASSWORD)

5. **Create Universities Dataset:**
   - Go to "Manage datasets" in the web UI
   - Click "Add new dataset"
   - Dataset name: `universities`
   - Dataset type: `TDB2`
   - Click "Create dataset"

## Fuseki Endpoints

### Universities Dataset

- **SPARQL Query**: `http://localhost:3030/universities/sparql`
- **SPARQL Update**: `http://localhost:3030/universities/update`
- **Graph Store**: `http://localhost:3030/universities/data`
- **Upload**: `http://localhost:3030/universities/upload`

### Example SPARQL Queries

**Insert a University:**
```sparql
PREFIX uni: <http://isakwa.edu/ontology/university#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

INSERT DATA {
  <http://isakwa.edu/resource/university/1> a uni:University ;
    uni:name "University of Belgrade" ;
    uni:city "Belgrade" ;
    uni:country "Serbia" ;
    uni:establishedYear "1808"^^xsd:gYear ;
    uni:isActive true ;
    uni:website <http://www.bg.ac.rs> .
}
```

**Query Universities:**
```sparql
PREFIX uni: <http://isakwa.edu/ontology/university#>

SELECT ?university ?name ?city ?country WHERE {
  ?university a uni:University ;
    uni:name ?name ;
    uni:city ?city ;
    uni:country ?country .
}
```

**Full-text Search:**
```sparql
PREFIX text: <http://jena.apache.org/text#>
PREFIX uni: <http://isakwa.edu/ontology/university#>

SELECT ?university ?name ?score WHERE {
  (?university ?score) text:query "Belgrade" .
  ?university uni:name ?name .
}
```

## Configuration Files

- **`docker-compose.yml`**: Main Docker Compose configuration
- **`fuseki/config/universities-dataset.ttl`**: Fuseki dataset configuration with text indexing
- **`fuseki/ontology/university-ontology.ttl`**: University domain ontology
- **`env.example`**: Environment variables template

## Data Persistence

- **Fuseki Data**: `fuseki_data` volume (`/fuseki/databases`)
- **Fuseki Config**: `fuseki_config` volume (`/fuseki/configuration`)

## Management Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f fuseki

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: deletes all data)
docker-compose down -v

# Restart Fuseki only
docker-compose restart fuseki

# Execute commands in Fuseki container
docker-compose exec fuseki bash
```

## Development Integration

Add these scripts to your project's root `package.json`:

```json
{
  "scripts": {
    "infra:up": "cd infra/docker && docker-compose up -d",
    "infra:down": "cd infra/docker && docker-compose down",
    "infra:logs": "cd infra/docker && docker-compose logs -f",
    "dev:full": "yarn infra:up && yarn dev"
  }
}
```

## Troubleshooting

1. **Port 3030 already in use:**
   ```bash
   # Check what's using the port
   netstat -an | findstr :3030
   # Or change FUSEKI_PORT in .env file
   ```

2. **Container won't start:**
   ```bash
   # Check container logs
   docker-compose logs fuseki
   ```

3. **Data not persisting:**
   - Ensure volumes are properly mounted
   - Check volume permissions

4. **Text search not working:**
   - Verify text index configuration in `universities-dataset.ttl`
   - Rebuild text index if needed

## Security Notes

- Change default admin password in production
- Configure proper network security for production deployments
- Consider using secrets management for sensitive configuration
