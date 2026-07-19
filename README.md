<div align="center">
  <img src="./frontend/public/favicon.ico" alt="Synapse Logo" width="120" />

  <h1>Synapse</h1>
  <p><strong>AI-Powered Workspace, Project, and Team Management Platform</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
    <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

---

## 📖 Project Overview

**Synapse** is an enterprise-grade project management ecosystem designed to streamline hierarchical organizational workflows. By enforcing a strict four-tier role architecture (Owner, Manager, Team Lead, Employee), Synapse mirrors real-world corporate structures, ensuring that task delegation, progress tracking, and approvals follow a robust chain of command.

Built with a modern tech stack, the platform leverages **Socket.IO** for instantaneous real-time updates and integrates the **Gemini AI API** to automate tedious administrative tasks. From generating subtasks to providing predictive productivity analytics, the AI engine acts as a co-pilot for management, drastically reducing overhead.

Whether scaling a startup or managing a large department, Synapse provides unparalleled visibility into team velocity, bottlenecks, and cross-departmental collaboration, all encapsulated in a beautiful, responsive user interface.

---

## ✨ Feature Matrix

| Module | Status | Description |
| :--- | :---: | :--- |
| **Workspace Management** | 🟢 Complete | Multi-workspace support with isolated data domains. |
| **Role-Based Access (RBAC)** | 🟢 Complete | Strict 4-tier hierarchy enforcing distinct permissions. |
| **Task Delegation** | 🟢 Complete | Multi-level cascade (Project → Task → SubTask → WorkItem). |
| **Real-Time Notifications** | 🟢 Complete | WebSocket-driven live alerts and workflow triggers. |
| **AI Work Breakdown** | 🟢 Complete | Automated generation of SubTasks and WorkItems via Gemini. |
| **Analytics & Insights** | 🟢 Complete | AI-driven productivity insights and predictive bottlenecks. |

---

## 🏛️ Architecture

<details>
<summary><strong>System Architecture</strong></summary>

```mermaid
graph TD
    Client["Client (React + Vite)"]
    API["API Gateway (Express.js)"]
    DB[(PostgreSQL)]
    Cache[(Redis)]
    AI["AI Engine (Gemini API)"]
    Storage["Media Storage (Cloudinary)"]

    Client <-->|HTTPS / REST| API
    Client <-->|WSS / Socket.IO| API
    API <-->|Prisma ORM| DB
    API <-->|Pub/Sub & Cache| Cache
    API <-->|REST| AI
    API <-->|SDK| Storage
```
</details>

<details>
<summary><strong>Role Hierarchy</strong></summary>

```mermaid
graph TD
    O["👑 Owner"] --> M["👔 Manager"]
    M --> TL["🎯 Team Lead"]
    TL --> E["👨‍💻 Employee"]

    classDef owner fill:#4f46e5,color:#fff,stroke:#312e81;
    classDef manager fill:#0891b2,color:#fff,stroke:#164e63;
    classDef lead fill:#059669,color:#fff,stroke:#064e3b;
    classDef employee fill:#475569,color:#fff,stroke:#0f172a;

    class O owner;
    class M manager;
    class TL lead;
    class E employee;
```
</details>

<details>
<summary><strong>AI & Real-Time Flow</strong></summary>

```mermaid
sequenceDiagram
    participant U as User
    participant A as API Server
    participant R as Redis (Socket)
    participant G as Gemini AI

    U->>A: Request AI Subtasks (Task Context)
    A->>G: Prompt + Context Analysis
    G-->>A: Structured JSON Breakdown
    A->>A: Save to Database
    A->>R: Emit 'NEW_SUBTASKS' Event
    R-->>U: Live UI Update via Socket
```
</details>

---

## 🔄 Complete Application Workflow

```mermaid
stateDiagram-v2
    [*] --> WorkspaceCreated: Owner creates Workspace
    WorkspaceCreated --> ManagersAdded: Adds Managers
    ManagersAdded --> DepartmentCreated: Managers create Departments
    DepartmentCreated --> TeamsAssigned: Managers assign Teams
    TeamsAssigned --> ProjectsCreated: Managers create Projects
    ProjectsCreated --> LeadReceives: Team Leads receive Projects
    LeadReceives --> SubTasksCreated: Team Leads create SubTasks
    SubTasksCreated --> WorkItemsCreated: Team Leads create WorkItems
    WorkItemsCreated --> ItemsCompleted: Employees complete WorkItems
    ItemsCompleted --> InReview: SubTask marked 'In Review'
    InReview --> Approved: Team Lead approves
    Approved --> ProgressUpdated: Project Progress updates
    ProgressUpdated --> NotificationsTriggered: Notifications fire
    NotificationsTriggered --> AnalyticsGenerated: AI Analytics generated
    AnalyticsGenerated --> [*]
```

---

## 🗄️ Database ER Diagram

```mermaid
erDiagram
    USER ||--o{ WORKSPACE : "owns"
    USER ||--o{ NOTIFICATION : "receives"
    WORKSPACE ||--o{ DEPARTMENT : "contains"
    DEPARTMENT ||--o{ TEAM : "has"
    TEAM ||--o{ PROJECT : "assigned"
    PROJECT ||--o{ TASK : "contains"
    TASK ||--o{ SUBTASK : "broken down into"
    SUBTASK ||--o{ WORKITEM : "delegated as"

    WORKSPACE {
        uuid id PK
        string name
        string slug
    }
    PROJECT {
        uuid id PK
        string title
        string status
        date deadline
    }
    SUBTASK {
        uuid id PK
        string status
        uuid teamLeadId FK
    }
    WORKITEM {
        uuid id PK
        string status
        uuid employeeId FK
    }
```

---

## 📁 Folder Structure

```text
Synapse/
├── backend/
│   ├── src/
│   │   ├── config/        # Redis, Cloudinary, DB config
│   │   ├── controllers/   # Request handlers
│   │   ├── cron/          # Scheduled notification jobs
│   │   ├── middlewares/   # Auth, Upload, Error handling
│   │   ├── routes/        # Express route definitions
│   │   ├── service/       # Business logic & AI wrappers
│   │   ├── socket/        # Socket.IO event handlers
│   │   └── utils/         # Helpers & constants
│   ├── prisma/            # Schema & migrations
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios interceptors
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context (Auth, Socket)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Route views
│   │   └── services/      # API abstractions
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Real-Time** | Socket.IO, Redis |
| **AI Engine** | Google Gemini API |
| **Storage** | Cloudinary (Images/Avatars/Logos) |
| **Auth** | JWT (HttpOnly Cookies, Access/Refresh flow) |

---

## 📸 Screenshots

| Login & Authentication | Dashboard & Analytics |
| :---: | :---: |
| ![Login](/docs/screenshots/login.png) | ![Dashboard](/docs/screenshots/dashboard.png) |
| **Workspace Management** | **Project Board** |
| ![Workspace](/docs/screenshots/workspace.png) | ![Projects](/docs/screenshots/projects.png) |
| **Team Lead View** | **Employee View** |
| ![Team Lead](/docs/screenshots/team-lead.png) | ![Employee](/docs/screenshots/employee.png) |

*(Note: Add screenshot files to `/docs/screenshots/`)*

---

## 🚀 Installation & Setup

<details>
<summary><strong>1. Clone the Repository</strong></summary>

```bash
git clone https://github.com/yourusername/Synapse.git
cd Synapse
```
</details>

<details>
<summary><strong>2. Backend Setup</strong></summary>

```bash
cd backend
npm install

# Apply database migrations
npx prisma generate
npx prisma db push
```
</details>

<details>
<summary><strong>3. Frontend Setup</strong></summary>

```bash
cd ../frontend
npm install
```
</details>

<details>
<summary><strong>4. Running Locally</strong></summary>

Start Redis locally or via Docker:
```bash
docker run -d -p 6379:6379 redis
```

Start Backend (Terminal 1):
```bash
cd backend
npm run dev
```

Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
</details>

---

## ⚙️ Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/synapse"

# Authentication
ACCESS_TOKEN_SECRET="your_access_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_secret_key"

# Server
PORT=8080

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# AI Integration
OPEN_ROUTER_API_KEY="your_gemini_or_openrouter_key"

# Security
ENCRYPTION_KEY="your_256bit_encryption_key"
```

---

## 🔌 API Reference

<details>
<summary><strong>Authentication APIs</strong></summary>

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens |
| `POST` | `/api/auth/refresh-token`| Rotate JWT access token |
| `POST` | `/api/auth/logout` | Invalidate session |
</details>

<details>
<summary><strong>Workspace & Core APIs</strong></summary>

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/workspace/create` | Create a new isolated workspace |
| `GET` | `/api/project/list` | Retrieve workspace projects |
| `PUT`  | `/api/users/profile` | Update user profile |
| `POST` | `/api/ai/subtasks` | Generate subtasks via Gemini API |
| `PATCH`| `/api/notification/read` | Mark notifications as read |
</details>

---

## ⚡ Real-Time Features

Synapse utilizes a robust **Socket.IO** and **Redis** architecture to deliver an instantaneous experience:
- **Live Notifications**: Event-driven alerts push immediately to the relevant user's client when a task status changes or a comment is added.
- **Live Updates**: Collaborative views update in real-time. If a Team Lead approves a Work Item, the Employee's dashboard reflects the change without refreshing.
- **Presence System**: Real-time user online/offline status tracking across workspaces.

---

## 🧠 AI Features

By integrating the **Gemini API**, Synapse eliminates administrative bottlenecks:
- **AI Subtask Generation**: Automatically breakdown complex Projects into actionable SubTasks based on historical velocity and project scope.
- **AI Work Item Generation**: Granular conversion of SubTasks into specific Employee WorkItems.
- **AI Analytics**: Predictive insights identifying which projects are at risk of missing deadlines based on current completion rates.
- **Productivity Insights**: Sentiment and throughput analysis at the department level.

---

## ☁️ Deployment Architecture

Synapse is designed for scalable cloud deployment:

- **Frontend**: [Vercel](https://vercel.com/) (Serverless edge caching)
- **Backend**: [Railway](https://railway.app/) / Render (Dockerized Node.js containers)
- **Database**: Managed PostgreSQL (e.g., Supabase / Neon)
- **Cache / PubSub**: [Upstash](https://upstash.com/) (Serverless Redis)
- **Media**: [Cloudinary](https://cloudinary.com/) (CDN-optimized asset delivery)

---

## 🗺️ Future Roadmap

- [ ] **Mobile App**: React Native port for iOS & Android.
- [ ] **Calendar Integration**: Two-way sync with Google Calendar & Outlook.
- [ ] **Video Meetings**: Built-in WebRTC huddle rooms for Teams.
- [ ] **AI Assistant**: Conversational chat interface for querying project statuses.

---

## 👨‍💻 Contributors

- **Darshan Modi** - *Lead Engineer & Architect*

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---
<div align="center">
  <sub>Built with ❤️ by Darshan Modi</sub>
</div>
