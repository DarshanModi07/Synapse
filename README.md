# Synapse Architecture Documentation

**Version:** 1.0.0
**License:** MIT

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)

## 1. Executive Summary

Synapse is an AI-powered Workspace and Project Management platform architected for strict hierarchical ownership and distributed team collaboration. The system implements a robust event-driven communication layer and intelligent task orchestration logic to streamline business workflows. This documentation outlines the system design, network boundaries, and deployment architecture for the production environment.

## 2. Platform Hierarchy

The platform implements a multi-tenant hierarchy designed to segregate access and operational boundaries across organizational units.

```mermaid
graph TD
    A[Owner] --> B[Workspace]
    B --> C[Managers]
    C --> D[Departments]
    D --> E[Teams]
    E --> F[Team Leads]
    F --> G[Employees]
```

## 3. End-to-End Business Workflow

The core business logic dictates the lifecycle of workspace initialization, resource allocation, and task execution. 

```mermaid
graph TD
    A[Owner] --> B[Create Workspace]
    B --> C[Add Manager]
    C --> D[Create Department]
    D --> E[Create Team]
    E --> F[Assign Team Lead]
    F --> G[Create Project]
    G --> H[Create Task]
    H --> I[Generate SubTasks]
    I --> J[Generate WorkItems]
    J --> K[Employee Completes WorkItems]
    K --> L[SubTask under Review]
    L --> M[Team Lead Approves]
    M --> N[Task Completed]
    N --> O[Notifications Sent]
    O --> P[Analytics Updated]
```

## 4. Authentication Architecture

The Authentication Layer utilizes a dual-token mechanism (JWT) paired with cryptographic verification for initial identity negotiation.

### Authentication Flow

```mermaid
graph TD
    A[User Login] --> B[Validate Credentials]
    B --> C[SHA-256 Password Verification]
    C --> D[Generate Access Token]
    C --> E[Generate Refresh Token]
    E --> F[Store Refresh Token]
    F --> G[HTTP Only Cookie]
    G --> H[Return User Session]
```

### Access Token Flow

```mermaid
graph TD
    A[Request] --> B[Verify JWT]
    B --> C{Valid?}
    C -->|Yes| D[Continue]
    C -->|No| E[Return 401]
```

### Refresh Token Flow

Session Management handles seamless token rotation to minimize access interruption.

```mermaid
graph TD
    A[Access Token Expired] --> B[Frontend Calls Refresh Endpoint]
    B --> C[Verify Refresh Token]
    C --> D[Verify Session]
    D --> E[Generate New Access Token]
    E --> F[Update Cookie]
    F --> G[Continue Session]
```

## 5. Caching Strategy

The system utilizes Redis as an in-memory data store to minimize relational database saturation during high-frequency read operations.

### Redis Cache Flow

```mermaid
graph TD
    A[Client Request] --> B[Redis Lookup]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return Data]
    C -->|No| E[Prisma Query]
    E --> F[PostgreSQL]
    F --> G[Cache Result]
    G --> H[Return Response]
```

## 6. Event-Driven Communication

Event propagation is localized to connected clients through a centralized WebSocket interface.

### Notification Architecture

```mermaid
graph TD
    A[User Action] --> B[Notification Service]
    B --> C[Redis Queue]
    C --> D[Socket.IO]
    D --> E[Connected Users]
```

### Socket.IO Workflow

```mermaid
graph TD
    A[Client Connects] --> B[Authenticate]
    B --> C[Join User Room]
    C --> D[Join Workspace Room]
    D --> E[Listen for Events]
    E --> F[Receive Live Updates]
```

## 7. AI Suggestion Workflow

The Service Layer integrates with the Gemini API to orchestrate intelligent decomposition of complex project definitions.

```mermaid
graph TD
    A[Task Created] --> B[Gemini API]
    B --> C[Generate SubTasks]
    C --> D[Generate WorkItems]
    D --> E[Team Lead Reviews]
    E --> F[Accept / Reject]
    F --> G[Persist to Database]
```

## 8. Request Lifecycle

The API request lifecycle enforces strict boundary separation across middleware and service layers.

```mermaid
graph TD
    A[Browser] --> B[Axios]
    B --> C[Middleware]
    C --> D[Controller]
    D --> E[Service]
    E --> F[Prisma]
    F --> G[PostgreSQL]
    G --> H[Response]
```

## 9. Database Architecture

The persistence layer guarantees ACID compliance and referential integrity.

### Database ER Diagram

```mermaid
erDiagram
    User ||--o{ Workspace : "owns"
    User ||--o{ Notification : "receives"
    Workspace ||--o{ Department : "contains"
    Department ||--o{ Team : "allocates"
    Team ||--o{ Project : "assigned"
    Project ||--o{ Task : "divided into"
    Task ||--o{ SubTask : "decomposed into"
    SubTask ||--o{ WorkItem : "broken down into"

    User {
        uuid id
    }
    Workspace {
        uuid id
    }
    Department {
        uuid id
    }
    Team {
        uuid id
    }
    Project {
        uuid id
    }
    Task {
        uuid id
    }
    SubTask {
        uuid id
    }
    WorkItem {
        uuid id
    }
    Notification {
        uuid id
    }
```

## 10. Production Deployment

The infrastructure leverages a distributed set of managed platforms for high availability and horizontal scalability.

### Deployment Architecture

```mermaid
graph TD
    A[Vercel] --> B[Railway]
    B --> C[PostgreSQL]
    B --> D[Redis]
    B --> E[Cloudinary]
    B --> F[Gemini]
```

## 11. Specifications and Requirements

### Tech Stack

| Domain | Technology |
| --- | --- |
| Frontend | React, Vite |
| UI Framework | Tailwind CSS |
| Backend API | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Caching & Pub/Sub | Redis |
| Real-Time Engine | Socket.IO |
| AI Integration | Gemini API |
| Media Storage | Cloudinary |

### Feature Matrix

| Feature | Subsystem | Status |
| --- | --- | --- |
| JWT Authentication | Security Layer | Production Ready |
| Role-Based Access Control | Authorization Layer | Production Ready |
| Telemetry & Broadcasting | Event-Driven Communication | Production Ready |
| AI Auto-Generation | Service Layer | Production Ready |
| Distributed Object Storage | Asset Delivery | Production Ready |

### Role Permissions

| Role | Scope | Permissions |
| --- | --- | --- |
| Owner | Workspace | Full Workspace Configuration, Global Privileges |
| Manager | Department | Manage Projects, Allocate Teams |
| Team Lead | Project | Manage SubTasks, Review WorkItems |
| Employee | WorkItem | Execute WorkItems, Update Status |

### Environment Variables

| Variable | Requirement | Description |
| --- | --- | --- |
| `DATABASE_URL` | Required | Relational database connection string. |
| `ACCESS_TOKEN_SECRET` | Required | Cryptographic secret for JWT signing. |
| `REFRESH_TOKEN_SECRET` | Required | Cryptographic secret for session rotation. |
| `REDIS_URL` | Optional | Cache endpoint configuration. |
| `GEMINI_API_KEY` | Required | Access token for AI orchestration layer. |
| `CLOUDINARY_URL` | Required | Connection string for media persistence. |

### API Overview

| Module | Protocol | Pattern | Responsibility |
| --- | --- | --- | --- |
| Auth | REST | `/api/auth/*` | Session Management |
| Users | REST | `/api/users/*` | Identity Configuration |
| Workspaces | REST | `/api/workspace/*` | Resource Boundary Management |
| Projects | REST | `/api/project/*` | Scope Allocation |
| Sockets | WSS | `/socket.io/*` | Event Telemetry |

### Deployment Checklist

| Phase | Task | Status |
| --- | --- | --- |
| Security | Configure Cross-Origin Resource Sharing (CORS). | Pending |
| Security | Disable verbose error reporting on public endpoints. | Pending |
| Infrastructure | Apply Prisma schema migrations to production RDS. | Pending |
| Infrastructure | Initialize Upstash Redis instance bounds. | Pending |
| Telemetry | Implement application logging aggregation. | Pending |

## 12. Folder Structure

```text
Synapse/
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── prisma/
│   └── sockets/
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── utils/
└── README.md
```
