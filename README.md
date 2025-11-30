# SWStarter

A full-stack Star Wars search application built with TypeScript, featuring Redis caching, queue-based statistics processing, and comprehensive test coverage.

## Tech Stack

**Backend:**
- TypeScript
- Node.js 18 + Express 4.18
- Prisma ORM (PostgreSQL 15)
- Redis 7 (caching + queues)
- BullMQ (job processing)
- Pino (structured logging)
- Jest + Supertest (testing)

**Frontend:**
- TypeScript
- React 18.2 + React Router 6
- SCSS/Sass
- Axios
- Jest + React Testing Library (testing)

**Infrastructure:**
- Docker + Docker Compose

## Features

- **Search**
  - Search Star Wars characters by name
  - Search Star Wars movies by title
  - Results cached in Redis for fast responses

- **Detail Pages**
  - Character details with associated films
  - Movie details with cast list
  - Navigation between related entities

- **Statistics Dashboard**
  - Top 5 most searched terms
  - Average API response time
  - Most popular search hour
  - Total query count
  - Processed via BullMQ every 5 minutes

- **Performance & Reliability**
  - Redis caching (1h for people, 24h for movies)
  - Rate limiting (100 req/15min, 30 searches/min)
  - Graceful SWAPI failure handling
  - Structured logging with Pino

- **Code Quality**
  - TypeScript strict mode
  - Atomic Design pattern (frontend)
  - Custom React hooks
  - 90%+ test coverage

## Prerequisites

- Docker Desktop
- Node.js 18+ (for running tests locally)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sizilio/swstarter
cd swstarter

# Run tests and start all containers
npm run docker:up

# Access the application
# Frontend: http://localhost:8080
# Backend:  http://localhost:3000
```

## Available Scripts

Run from the project root:

```bash
# Testing
npm test                    # Run all tests (API + Web)
npm run test:api            # Run backend tests only
npm run test:api:coverage   # Backend tests with coverage
npm run test:web            # Run frontend tests only
npm run test:web:coverage   # Frontend tests with coverage

# Docker
npm run docker:up           # Run tests + start containers
npm run docker:up:detached  # Run tests + start in background
npm run docker:down         # Stop containers and remove volumes
npm run docker:logs         # Show real-time logs
npm run docker:clean        # Stop, remove volumes and images
```

## API Endpoints

### Search
- `GET /api/search/people?name={name}` - Search characters
- `GET /api/search/movies?title={title}` - Search films

### Details
- `GET /api/search/people/:id` - Character details with films
- `GET /api/search/movies/:id` - Movie details with characters

### Statistics
- `GET /api/statistics` - Query statistics (updated every 5 min)

## Project Structure

```
swstarter/
├── api/                              # Backend
│   ├── config/
│   │   └── database.ts               # Prisma configuration
│   ├── controllers/
│   │   ├── searchController.ts
│   │   └── statisticsController.ts
│   ├── jobs/
│   │   └── computeStatistics.ts      # BullMQ worker
│   ├── models/
│   │   ├── Query.ts
│   │   └── Statistic.ts
│   ├── routes/
│   ├── services/
│   │   ├── swapiService.ts           # SWAPI + Redis cache
│   │   └── statisticsService.ts
│   ├── types/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── mocks/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.ts
│   └── tsconfig.json
│
├── web/                              # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── molecules/            # Simple components
│   │   │   │   ├── ResultCard/
│   │   │   │   └── SkeletonLoader/
│   │   │   └── organisms/            # Composite components
│   │   │       ├── Header/
│   │   │       ├── Layout/
│   │   │       ├── SearchBar/
│   │   │       └── ResultsList/
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useSearch.ts
│   │   │   ├── usePersonDetail.ts
│   │   │   └── useMovieDetail.ts
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── mocks/
│   └── tsconfig.json
│
├── docker-compose.yml
├── package.json                      # Root scripts
├── README.md
└── README_PT.md
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Network                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌─────────┐ │
│  │ React   │───▶│  Express    │───▶│PostgreSQL│    │  Redis  │ │
│  │ :8080   │    │  API :3000  │    │  :5432   │    │  :6379  │ │
│  └─────────┘    └──────┬──────┘    └──────────┘    └────┬────┘ │
│                        │                                │      │
│                        │         ┌──────────────────────┘      │
│                        │         │                             │
│                        ▼         ▼                             │
│                   ┌─────────────────┐                          │
│                   │     SWAPI       │                          │
│                   │ (external API)  │                          │
│                   └─────────────────┘                          │
│                                                                 │
│  Data Flow:                                                    │
│  1. React → Express API                                        │
│  2. API checks Redis cache                                     │
│  3. Cache miss → fetch from SWAPI → store in Redis             │
│  4. Log query to PostgreSQL                                    │
│  5. BullMQ processes statistics every 5 min                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Testing

The project has comprehensive test coverage:

| Area | Coverage |
|------|----------|
| Backend | 100% statements, 93% branches |
| Frontend | 98% statements, 90% branches |

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:api:coverage
npm run test:web:coverage
```

Tests run automatically before Docker starts (`npm run docker:up`).

## Environment Variables

**Backend (api/.env):**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://starwars:starwars123@db:5432/starwars
REDIS_URL=redis://redis:6379
```

**Frontend (web/.env):**
```env
PORT=8080
REACT_APP_API_URL=http://localhost:3000
```

Default values are pre-configured in `.env.example` files.

## Troubleshooting

**Containers not starting:**
```bash
npm run docker:clean
npm run docker:up
```

**Database connection issues:**
```bash
docker-compose logs db
```

**Redis connection issues:**
```bash
docker-compose logs redis
```

**Port conflicts:**
- Ensure ports 3000, 5432, 6379, 8080 are available

## License

This project was created as a technical assessment.
