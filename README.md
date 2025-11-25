# SWStarter

A full-stack application that searches the Star Wars API (SWAPI) with query statistics tracking and detailed views.

## Tech Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.20.0
- SCSS/Sass
- Axios

**Backend:**
- Node.js 18 (Alpine)
- Express 4.18.2
- PostgreSQL 15 (Alpine)
- node-cron 3.0.3 (scheduled jobs)

**DevOps:**
- Docker
- Docker Compose 3.8

## Features

- **Search Functionality**
  - Search Star Wars characters by name
  - Search Star Wars movies by title
  - Real-time search results with response time tracking

- **Detail Pages**
  - Individual character details with associated films
  - Individual movie details with cast list
  - Clickable links between related entities

- **Statistics Dashboard**
  - Top 5 most searched terms with percentages
  - Average API response time
  - Most popular search hour
  - Total query count
  - Auto-computed every 5 minutes via cron job

- **UX Features**
  - Responsive mobile-first design
  - Skeleton loading states
  - Error handling

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## How to Run

1. Clone the repository:
```bash
git clone <repository-url>
cd starwars
```

2. Set up environment variables (optional - default values are already configured):
```bash
# Copy .env.example files to .env (already done - files are ready to use)
# Both api/.env.example and web/.env.example contain default configurations
# You can customize them if needed, otherwise use as-is
```

3. Build and start all containers:
```bash
docker-compose up --build
```

4. Wait for all services to initialize (database, API, frontend)

5. Access the application:
   - **Frontend:** http://localhost:8080
   - **Backend API:** http://localhost:3000
   - **Database:** localhost:5432

6. To stop the application:
```bash
docker-compose down
```

**Note:** The `.env.example` files in both `api/` and `web/` folders contain all the necessary environment variables with default values. The Docker containers will work out of the box without any additional configuration.

## API Endpoints

### Search
- `GET /api/search/people?name={name}` - Search people by name
- `GET /api/search/movies?title={title}` - Search films by title

### Details
- `GET /api/search/people/:id` - Get person details with all films
- `GET /api/search/movies/:id` - Get movie details with all characters

### Statistics
- `GET /api/statistics` - Get query statistics (updated every 5 minutes)

### Health Check
- `GET /api/health` - Check API status

## Project Structure

```
starwars/
├── api/                          # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js           # PostgreSQL connection
│   ├── controllers/
│   │   ├── searchController.js   # Search & detail endpoints
│   │   └── statisticsController.js
│   ├── database/
│   │   └── schema.sql            # Database schema
│   ├── jobs/
│   │   └── computeStatistics.js  # Scheduled statistics job
│   ├── models/
│   │   ├── Query.js              # Query model
│   │   └── Statistic.js          # Statistics model
│   ├── routes/
│   │   ├── search.js
│   │   └── statistics.js
│   ├── services/
│   │   ├── swapiService.js       # SWAPI integration
│   │   └── statisticsService.js
│   ├── .env.example              # Environment variables template
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                 # Main entry point
│
├── web/                          # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   ├── Layout/
│   │   │   ├── ResultCard/
│   │   │   ├── ResultsList/
│   │   │   ├── SearchBar/
│   │   │   ├── SkeletonLoader/
│   │   │   └── Statistics/
│   │   ├── pages/
│   │   │   ├── SearchPage/
│   │   │   ├── StatsPage/
│   │   │   ├── PeopleDetailPage/
│   │   │   └── MovieDetailPage/
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   ├── utils/
│   │   │   └── helpers.js        # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example              # Environment variables template
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml            # Docker orchestration
├── README.md
└── README_PT.md                  # Portuguese version
```

## Database Schema

**queries** table:
- id (SERIAL PRIMARY KEY)
- search_term (VARCHAR)
- search_type (VARCHAR)
- results_count (INTEGER)
- response_time_ms (INTEGER)
- created_at (TIMESTAMP)

**statistics** table:
- id (SERIAL PRIMARY KEY)
- top_queries (JSONB)
- avg_response_time (NUMERIC)
- most_popular_hour (INTEGER)
- total_queries (INTEGER)
- computed_at (TIMESTAMP)

## Development

The application runs in Docker containers:

- **Frontend:** React Scripts with Webpack HMR
- **Backend:** Nodemon for auto-restart on changes
- **Database:** PostgreSQL with persistent volume

### Environment Variables

The project includes `.env.example` files with all necessary configurations. The Docker setup works with these default values without requiring any changes.

**Backend (api/.env.example):**
```
NODE_ENV=development
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=starwars
DB_USER=starwars
DB_PASSWORD=starwars123
```

**Frontend (web/.env.example):**
```
PORT=8080
REACT_APP_API_URL=http://localhost:3000
```

**If you need to customize:** Simply copy the `.env.example` files to `.env` and modify as needed:
```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

## Notes

- Statistics are automatically computed every 5 minutes using node-cron
- All search queries are logged to PostgreSQL with response times
- The frontend communicates exclusively with the backend API (not directly with SWAPI)
- Backend fetches nested resources in parallel using Promise.all()
- Database uses connection pooling for better performance
- Docker volumes ensure data persistence across container restarts

## Architecture

**3-Tier Architecture:**
1. **Frontend (Client):** React SPA with client-side routing
2. **Backend (Application):** RESTful API with MVC-inspired structure
3. **Database (Data):** PostgreSQL for persistence

**Data Flow:**
```
User → React (8080) → Express API (3000) → PostgreSQL (5432) / SWAPI
```

## Troubleshooting

**Containers not starting:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

**Database connection issues:**
- Ensure port 5432 is not in use
- Check docker-compose logs: `docker-compose logs db`

**Frontend not loading:**
- Ensure port 8080 is not in use
- Check browser console for errors
- Verify REACT_APP_API_URL in web/.env

## License

This project was created as a take-home exercise.