# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload (port 8080)
- `npm test` - Run all tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Database Management
- `npm run docker:start` - Start PostgreSQL container
- `npm run docker:stop` - Stop containers
- `npm run docker:clean` - Remove containers and volumes

### Testing Individual Components
- `npx jest test/entity/Cliente.test.ts` - Run specific entity tests
- `npx jest test/usecase/` - Run all use case tests
- `npx jest test/api/` - Run API integration tests

## Architecture Overview

This is a Node.js/TypeScript REST API following Clean Architecture and Domain-Driven Design principles for a "Caldos e Sopas" (Soup Kitchen) business management system.

### Core Architecture Layers

1. **Domain Layer** (`src/domain/`)
   - **Entities**: Business objects with behavior (Cliente, Pedido, Produto, Endereco)
   - **Value Objects**: Immutable data types with validation (Cpf, Email, Telefone, Nome, etc.)
   - Rich domain models using factory methods and encapsulation

2. **Application Layer** (`src/application/usecase/`)
   - Use cases represent business operations (RegistrarCliente, BuscarPedidos, GerarCobranca)
   - Each use case is a single class focusing on one business capability
   - Orchestrates domain entities and external services

3. **Infrastructure Layer** (`src/infra/`)
   - **Controllers**: HTTP route handlers with error handling
   - **Repositories**: Database access using pg-promise
   - **Gateways**: External service integrations (Asaas payment gateway, BrasilAPI)
   - **Database**: PostgreSQL connection management
   - **DI**: Custom dependency injection container with decorator support

### Key Patterns & Components

- **Dependency Injection**: Custom Registry singleton with `@inject` decorator
- **Error Handling**: Structured error types (ValidationError, NotFoundError, ExternalServiceError)
- **HTTP Responses**: Standardized response format via HttpResponse class
- **Value Objects**: Validation logic encapsulated in domain VOs
- **Repository Pattern**: Database abstractions for each aggregate root

### External Integrations

- **Asaas Gateway**: Payment processing and customer management
- **BrasilAPI Gateway**: CEP/address lookup services
- **PostgreSQL**: Primary database with Docker setup

### Database Setup

The system uses PostgreSQL with schema defined in `create.sql`. Database connection uses environment variables defined in `docker-compose.yml`:
- Host: localhost:5432
- Database: app (configurable via `DATABASE_NAME`)
- User/Password: via environment variables

### Main Entry Point

`src/main.ts` bootstraps the application by:
1. Configuring the DI container with all dependencies
2. Setting up gateways, repositories, use cases, and controllers
3. Starting the Express server on port 8080

All dependencies are manually registered in main.ts following the dependency graph from infrastructure → application → domain.

### Logging System

The application uses a robust, structured logging system with the following features:

- **Structured JSON Logs**: All logs are output in JSON format with consistent fields
- **Log Levels**: trace, debug, info, warn, error, fatal (configurable via LOG_LEVEL env var)
- **Request Tracing**: Each HTTP request gets a unique traceId for correlation
- **Data Sanitization**: Automatically redacts sensitive information (passwords, CPF, emails, etc.)
- **Audit Logs**: Special audit() method for tracking critical business operations
- **Context Enrichment**: Logs include request metadata (IP, user agent, method, path)

Key logging features:
- Use `logger.audit(action, resource, context)` for business-critical operations
- Request/response logging via LoggingMiddleware
- Automatic error correlation with trace IDs
- Child loggers for request-scoped context