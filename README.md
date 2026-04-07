# CompValuation — Full-Stack Task Management App

A production-ready task management application built with **FastAPI** (backend) and **React + TypeScript** (frontend), deployable to Railway.

## Features

- **Authentication** — JWT-based login/register with refresh tokens
- **Task Management** — Create, edit, delete, and filter tasks by status & priority
- **Role-based Access** — Admin and user roles with appropriate permissions
- **Dashboard** — Statistics overview with task counts by status and priority
- **Dark Mode** — Toggle between light and dark themes
- **Responsive UI** — Ant Design components with Tailwind utilities

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy (async), asyncpg |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT (python-jose), bcrypt |
| Frontend | React 18, TypeScript, Vite |
| State | Zustand (persisted) |
| Data Fetching | TanStack Query v5 |
| UI | Ant Design v5, Tailwind CSS |
| Deployment | Railway, Docker |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (for local full-stack)
- PostgreSQL + Redis (or use Docker Compose)

### Local Development (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/Mikcharls311/CompValuation.git
cd CompValuation

# Start all services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### Backend Only

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, SECRET_KEY, etc.

# Run development server
uvicorn app.main:app --reload --port 8000
```

### Frontend Only

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL= (leave blank to use Vite proxy to localhost:8000)

# Run development server
npm run dev
# Frontend: http://localhost:5173
```

## Demo Accounts

After seeding, these accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | AdminPass123! | Admin |
| user@example.com | UserPass123! | User |
| viewer@example.com | ViewerPass123! | User |

## API Documentation

Interactive API docs available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | None |
| POST | `/api/v1/auth/register` | Register new user | None |
| POST | `/api/v1/auth/login` | Login (returns tokens) | None |
| GET | `/api/v1/auth/me` | Get current user | Required |
| GET | `/api/v1/tasks` | List tasks | Required |
| POST | `/api/v1/tasks` | Create task | Required |
| PATCH | `/api/v1/tasks/{id}` | Update task | Required |
| DELETE | `/api/v1/tasks/{id}` | Delete task | Required |
| GET | `/api/v1/stats` | Dashboard stats | Required |
| GET | `/api/v1/users` | List users | Admin |

## Running Tests

```bash
cd backend
pytest
```

## Deployment (Railway)

### Backend

1. Create a new Railway project and add a **PostgreSQL** and **Redis** service
2. Create a new service from the `backend/` directory
3. Set environment variables:
   - `DATABASE_URL` — from Railway PostgreSQL
   - `REDIS_URL` — from Railway Redis
   - `SECRET_KEY` — a strong random string
   - `ALLOWED_ORIGINS` — your frontend Railway URL

### Frontend

1. Create a new Railway service from the `frontend/` directory
2. Set environment variables:
   - `BACKEND_URL` — your backend Railway service URL (internal Railway URL preferred)

Railway will auto-detect the `railway.toml` and `Dockerfile` in each directory.

## Project Structure

```
CompValuation/
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/v1/    # Route handlers
│   │   ├── core/      # Security & dependencies
│   │   ├── crud/      # Database operations
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── utils/     # Logging & seeding
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/          # React + TypeScript application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # React Query hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── store/       # Zustand state stores
│   │   └── types/       # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## License

MIT
