# Next.js + Redis Challenge

## Overview
This project is a Next.js application that integrates Redis for caching and performance optimization. The setup involves environment variables, Docker for containerization, and benchmarking tools.

## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Recommended: v16 or later)
- [Docker](https://www.docker.com/get-started) & Docker Compose
- Redis (if running locally outside Docker)

## Why Use Docker for Redis?
Using **Docker** to manage Redis provides several advantages:
- **Consistency**: Ensures Redis runs in a reproducible environment across different machines.
- **Isolation**: Prevents conflicts with other local Redis installations.
- **Simplified Setup**: Eliminates the need to manually install Redis—just run `docker-compose up -d`.
- **Easy Cleanup**: Containers can be stopped or removed without affecting the host system.

## Setup Instructions

### 1. Install Dependencies
Run the following command in the project root directory to install the necessary dependencies:
```sh
npm install
cp .env.local.exemple .env.local
npm run setup
npm run dev

### . Running Benchmarks
To measure the speed of Redis caching, open a new terminal window, navigate to the project folder, and execute:
node scripts/benchmarks.js
