# SWStarter

Uma aplicação full-stack de busca Star Wars construída com TypeScript, com cache Redis, processamento de estatísticas via filas e cobertura abrangente de testes.

## Stack Tecnológica

**Backend:**
- TypeScript
- Node.js 18 + Express 4.18
- Prisma ORM (PostgreSQL 15)
- Redis 7 (cache + filas)
- BullMQ (processamento de jobs)
- Pino (logging estruturado)
- Jest + Supertest (testes)

**Frontend:**
- TypeScript
- React 18.2 + React Router 6
- SCSS/Sass
- Axios
- Jest + React Testing Library (testes)

**Infraestrutura:**
- Docker + Docker Compose

## Funcionalidades

- **Busca**
  - Buscar personagens Star Wars por nome
  - Buscar filmes Star Wars por título
  - Resultados cacheados no Redis para respostas rápidas

- **Páginas de Detalhes**
  - Detalhes de personagem com filmes associados
  - Detalhes de filme com lista de elenco
  - Navegação entre entidades relacionadas

- **Painel de Estatísticas**
  - Top 5 termos mais buscados
  - Tempo médio de resposta da API
  - Hora mais popular de busca
  - Contagem total de consultas
  - Processado via BullMQ a cada 5 minutos

- **Performance e Confiabilidade**
  - Cache Redis (1h para pessoas, 24h para filmes)
  - Rate limiting (100 req/15min, 30 buscas/min)
  - Tratamento gracioso de falhas da SWAPI
  - Logging estruturado com Pino

- **Qualidade de Código**
  - TypeScript modo strict
  - Padrão Atomic Design (frontend)
  - Custom React hooks
  - 90%+ de cobertura de testes

## Pré-requisitos

- Docker Desktop
- Node.js 18+ (para rodar testes localmente)

## Início Rápido

```bash
# Clone o repositório
git clone https://github.com/sizilio/swstarter
cd swstarter

# Rode os testes e inicie todos os containers
npm run docker:up

# Acesse a aplicação
# Frontend: http://localhost:8080
# Backend:  http://localhost:3000
```

## Scripts Disponíveis

Execute a partir da raiz do projeto:

```bash
# Testes
npm test                    # Roda todos os testes (API + Web)
npm run test:api            # Roda apenas testes do backend
npm run test:api:coverage   # Testes do backend com cobertura
npm run test:web            # Roda apenas testes do frontend
npm run test:web:coverage   # Testes do frontend com cobertura

# Docker
npm run docker:up           # Roda testes + inicia containers
npm run docker:up:detached  # Roda testes + inicia em background
npm run docker:down         # Para containers e remove volumes
npm run docker:logs         # Mostra logs em tempo real
npm run docker:clean        # Para, remove volumes e imagens
```

## Endpoints da API

### Busca
- `GET /api/search/people?name={name}` - Buscar personagens
- `GET /api/search/movies?title={title}` - Buscar filmes

### Detalhes
- `GET /api/search/people/:id` - Detalhes do personagem com filmes
- `GET /api/search/movies/:id` - Detalhes do filme com personagens

### Estatísticas
- `GET /api/statistics` - Estatísticas de consultas (atualizado a cada 5 min)

## Estrutura do Projeto

```
swstarter/
├── api/                              # Backend
│   ├── config/
│   │   └── database.ts               # Configuração Prisma
│   ├── controllers/
│   │   ├── searchController.ts
│   │   └── statisticsController.ts
│   ├── jobs/
│   │   └── computeStatistics.ts      # Worker BullMQ
│   ├── models/
│   │   ├── Query.ts
│   │   └── Statistic.ts
│   ├── routes/
│   ├── services/
│   │   ├── swapiService.ts           # SWAPI + cache Redis
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
│   │   │   ├── molecules/            # Componentes simples
│   │   │   │   ├── ResultCard/
│   │   │   │   └── SkeletonLoader/
│   │   │   └── organisms/            # Componentes compostos
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
├── package.json                      # Scripts da raiz
├── README.md                         # Versão em inglês
└── README_PT.md
```

## Arquitetura

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
│                   │  (API externa)  │                          │
│                   └─────────────────┘                          │
│                                                                 │
│  Fluxo de Dados:                                               │
│  1. React → Express API                                        │
│  2. API verifica cache Redis                                   │
│  3. Cache miss → busca na SWAPI → armazena no Redis            │
│  4. Registra consulta no PostgreSQL                            │
│  5. BullMQ processa estatísticas a cada 5 min                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Testes

O projeto possui cobertura abrangente de testes:

| Área | Cobertura |
|------|-----------|
| Backend | 100% statements, 93% branches |
| Frontend | 98% statements, 90% branches |

```bash
# Rodar todos os testes
npm test

# Rodar com relatório de cobertura
npm run test:api:coverage
npm run test:web:coverage
```

Os testes rodam automaticamente antes do Docker iniciar (`npm run docker:up`).

## Variáveis de Ambiente

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

Valores padrão já estão pré-configurados nos arquivos `.env.example`.

## Resolução de Problemas

**Containers não iniciam:**
```bash
npm run docker:clean
npm run docker:up
```

**Problemas de conexão com banco de dados:**
```bash
docker-compose logs db
```

**Problemas de conexão com Redis:**
```bash
docker-compose logs redis
```

**Conflitos de porta:**
- Certifique-se que as portas 3000, 5432, 6379, 8080 estão disponíveis

## Licença

Este projeto foi criado como uma avaliação técnica.
