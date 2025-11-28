# Task Management API

A simple, cloud-ready REST API for a Task Management system built with TypeScript, Express, TypeORM, and MySQL.

## Features

- **User Authentication**: Register and Login with JWT.
- **Task Management**: Create, Read, Update, Delete (Soft Delete) tasks.
- **Security**: Password hashing, Helmet, CORS.
- **Documentation**: OpenAPI 3.0 (Swagger UI).
- **Dockerized**: Easy setup with Docker Compose.
- **Testing**: Integration tests with Jest and Supertest.

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd assignment-d-jungle
    ```

2.  **Environment Setup:**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

3.  **Run with Docker (Recommended):**
    ```bash
    docker-compose up --build
    ```
    The API will be available at `http://localhost:3000`.

4.  **Run Locally (Development):**
    Ensure you have a MySQL instance running and update `.env` accordingly.
    ```bash
    npm install
    npm run dev
    ```

## API Documentation

 `http://localhost:3000/api-docs`

## Running Tests


1.  Start the database container:
    ```bash
    docker-compose up -d mysql
    ```

2.  Run tests:
    ```bash
    npm test
    ```

## Project Structure

- `src/config`: Database and environment configuration.
- `src/controllers`: Request handlers.
- `src/dto`: Data Transfer Objects for validation.
- `src/entities`: TypeORM entities (User, Task).
- `src/middlewares`: Authentication and other middlewares.
- `src/routes`: API route definitions.
- `src/services`: Business logic.
- `src/tests`: Integration tests.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for details on design choices.
