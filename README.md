# Tunisia Stay - Hotel Management System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mahdihemdane-3925s-projects/v0-hotel-management)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ROZLWT9LmZw)

## Overview

Tunisia Stay is a hotel booking platform for Tunisia, featuring a Spring Boot backend and a Next.js frontend.

## Requirements

- Java 17 (required for backend)
- Node.js 16+ (for frontend)
- MySQL 8.0 (or use Docker)

## Backend Development

### Building the Backend

The project uses Maven for building. We've included a Maven wrapper, so you don't need to install Maven separately.

#### Windows:
```
.\build.bat
```

#### Unix/Linux/macOS:
```
./build.sh
```

These scripts will:
1. Check your Java version (Java 17 is required)
2. Build the application using the Maven wrapper

### Running the Backend Locally

```
java -jar target/tunisia-stay-backend-0.0.1-SNAPSHOT.jar
```

The backend will be available at http://localhost:8080

## Docker Deployment

The entire application can be run using Docker Compose:

```
docker-compose up -d
```

This will start:
- MySQL database
- Backend API (Java)
- phpMyAdmin for database management

## API Documentation

Once the backend is running, Swagger UI is available at:
- http://localhost:8080/swagger-ui.html

## Frontend Development

The frontend is built with Next.js and is located in the root directory.

```
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Important Notes

- The backend requires Java 17. Using a different Java version may cause compatibility issues.
- When running in Docker, the frontend will automatically connect to the backend container.
- For local development, the frontend will connect to http://localhost:9000/api

## How It Works

1. The frontend communicates with the backend API
2. The backend processes requests and interacts with the MySQL database
3. Docker Compose orchestrates all services together
