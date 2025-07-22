# Docker Setup for QR Generator

This guide explains how to run the QR Generator application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### 1. Production Build

Build and run the production version:

```bash
# Build the Docker image
docker build -t qr-generator .

# Run the container
docker run -p 3000:3000 qr-generator
```

Or use Docker Compose:

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### 2. Development Build (with hot reloading)

For development with hot reloading:

```bash
# Run development version
docker-compose --profile dev up --build qr-generator-dev

# Or run directly
docker build -f Dockerfile.dev -t qr-generator-dev .
docker run -p 3001:3000 -v $(pwd):/app -v /app/node_modules qr-generator-dev
```

## Available Commands

### Docker Commands

```bash
# Build production image
docker build -t qr-generator .

# Build development image
docker build -f Dockerfile.dev -t qr-generator-dev .

# Run production container
docker run -p 3000:3000 qr-generator

# Run development container with volume mounting
docker run -p 3001:3000 -v $(pwd):/app -v /app/node_modules qr-generator-dev

# Stop all containers
docker stop $(docker ps -q --filter ancestor=qr-generator)

# Remove containers
docker rm $(docker ps -aq --filter ancestor=qr-generator)

# Remove images
docker rmi qr-generator qr-generator-dev
```

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Start development service
docker-compose --profile dev up qr-generator-dev

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs qr-generator
```

## Configuration

### Environment Variables

You can customize the application using environment variables:

```bash
# Set custom port
docker run -p 8080:3000 -e PORT=3000 qr-generator

# Disable telemetry
docker run -p 3000:3000 -e NEXT_TELEMETRY_DISABLED=1 qr-generator
```

### Docker Compose Environment

Create a `.env` file in the project root:

```env
# .env file
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Use different port
   docker run -p 3001:3000 qr-generator
   ```

2. **Build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t qr-generator .
   ```

3. **Container won't start**
   ```bash
   # Check logs
   docker logs <container-id>
   
   # Run interactively
   docker run -it qr-generator sh
   ```

### Performance Optimization

1. **Multi-stage builds**: The Dockerfile uses multi-stage builds to reduce image size
2. **Layer caching**: Dependencies are installed before copying source code
3. **Standalone output**: Next.js standalone output reduces runtime dependencies

## Production Deployment

### Using Docker Hub

```bash
# Tag for Docker Hub
docker tag qr-generator yourusername/qr-generator:latest

# Push to Docker Hub
docker push yourusername/qr-generator:latest

# Pull and run from Docker Hub
docker run -p 3000:3000 yourusername/qr-generator:latest
```

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml qr-generator-stack

# Scale service
docker service scale qr-generator-stack_qr-generator=3
```

### Health Checks

Add health check to docker-compose.yml:

```yaml
services:
  qr-generator:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Security Considerations

1. **Non-root user**: The production Dockerfile runs as non-root user
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **No sensitive data**: Ensure no secrets are in the image
4. **Regular updates**: Keep base images updated

## Monitoring

### Container Stats

```bash
# View resource usage
docker stats

# View specific container
docker stats qr-generator-app
```

### Logs

```bash
# Follow logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

Access your application at:
- Production: http://localhost:3000
- Development: http://localhost:3001