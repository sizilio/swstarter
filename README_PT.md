# SWStarter

Uma aplicação full-stack que busca na API Star Wars (SWAPI) com rastreamento de estatísticas de consultas e visualizações detalhadas.

## Stack Tecnológica

**Frontend:**
- React 18.2.0
- React Router DOM 6.20.0
- SCSS/Sass
- Axios

**Backend:**
- Node.js 18 (Alpine)
- Express 4.18.2
- PostgreSQL 15 (Alpine)
- node-cron 3.0.3 (tarefas agendadas)

**DevOps:**
- Docker
- Docker Compose 3.8

## Funcionalidades

- **Funcionalidade de Busca**
  - Buscar personagens de Star Wars por nome
  - Buscar filmes de Star Wars por título
  - Resultados de busca em tempo real com rastreamento de tempo de resposta

- **Páginas de Detalhes**
  - Detalhes individuais de personagens com filmes associados
  - Detalhes individuais de filmes com lista de elenco
  - Links clicáveis entre entidades relacionadas

- **Painel de Estatísticas**
  - Top 5 termos mais buscados com porcentagens
  - Tempo médio de resposta da API
  - Hora mais popular de busca
  - Contagem total de consultas
  - Auto-computadas a cada 5 minutos via cron job

- **Recursos de UX**
  - Design responsivo mobile-first
  - Estados de carregamento com skeleton
  - Tratamento de erros

## Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado

## Como Executar

1. Clone o repositório:
```bash
git clone <repository-url>
cd starwars
```

2. Configure as variáveis de ambiente (opcional - valores padrão já estão configurados):
```bash
# Copie os arquivos .env.example para .env (já está pronto - arquivos prontos para uso)
# Tanto api/.env.example quanto web/.env.example contêm configurações padrão
# Você pode customizá-los se necessário, caso contrário use como estão
```

3. Build e inicie todos os containers:
```bash
docker-compose up --build
```

4. Aguarde todos os serviços inicializarem (banco de dados, API, frontend)

5. Acesse a aplicação:
   - **Frontend:** http://localhost:8080
   - **API Backend:** http://localhost:3000
   - **Banco de Dados:** localhost:5432

6. Para parar a aplicação:
```bash
docker-compose down
```

**Observação:** Os arquivos `.env.example` nas pastas `api/` e `web/` contêm todas as variáveis de ambiente necessárias com valores padrão. Os containers Docker funcionarão imediatamente sem qualquer configuração adicional.

## Endpoints da API

### Busca
- `GET /api/search/people?name={name}` - Buscar pessoas por nome
- `GET /api/search/movies?title={title}` - Buscar filmes por título

### Detalhes
- `GET /api/search/people/:id` - Obter detalhes de pessoa com todos os filmes
- `GET /api/search/movies/:id` - Obter detalhes de filme com todos os personagens

### Estatísticas
- `GET /api/statistics` - Obter estatísticas de consultas (atualizado a cada 5 minutos)

### Health Check
- `GET /api/health` - Verificar status da API

## Estrutura do Projeto

```
starwars/
├── api/                          # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js           # Conexão PostgreSQL
│   ├── controllers/
│   │   ├── searchController.js   # Endpoints de busca e detalhes
│   │   └── statisticsController.js
│   ├── database/
│   │   └── schema.sql            # Schema do banco de dados
│   ├── jobs/
│   │   └── computeStatistics.js  # Job agendado de estatísticas
│   ├── models/
│   │   ├── Query.js              # Modelo de Query
│   │   └── Statistic.js          # Modelo de Estatísticas
│   ├── routes/
│   │   ├── search.js
│   │   └── statistics.js
│   ├── services/
│   │   ├── swapiService.js       # Integração com SWAPI
│   │   └── statisticsService.js
│   ├── .env.example              # Template de variáveis de ambiente
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                 # Ponto de entrada principal
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
│   │   │   └── api.js            # Cliente API Axios
│   │   ├── utils/
│   │   │   └── helpers.js        # Funções auxiliares
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example              # Template de variáveis de ambiente
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml            # Orquestração Docker
├── README.md                     # Versão em inglês
└── README_PT.md                  # Versão em português
```

## Schema do Banco de Dados

**Tabela queries:**
- id (SERIAL PRIMARY KEY)
- search_term (VARCHAR)
- search_type (VARCHAR)
- results_count (INTEGER)
- response_time_ms (INTEGER)
- created_at (TIMESTAMP)

**Tabela statistics:**
- id (SERIAL PRIMARY KEY)
- top_queries (JSONB)
- avg_response_time (NUMERIC)
- most_popular_hour (INTEGER)
- total_queries (INTEGER)
- computed_at (TIMESTAMP)

## Desenvolvimento

A aplicação roda em containers Docker:

- **Frontend:** React Scripts com Webpack HMR
- **Backend:** Nodemon para reinicialização automática em mudanças
- **Banco de Dados:** PostgreSQL com volume persistente

### Variáveis de Ambiente

O projeto inclui arquivos `.env.example` com todas as configurações necessárias. O setup Docker funciona com esses valores padrão sem necessitar de mudanças.

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

**Se precisar customizar:** Simplesmente copie os arquivos `.env.example` para `.env` e modifique conforme necessário:
```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

## Observações

- Estatísticas são computadas automaticamente a cada 5 minutos usando node-cron
- Todas as consultas de busca são registradas no PostgreSQL com tempos de resposta
- O frontend comunica exclusivamente com a API do backend (não diretamente com SWAPI)
- Backend busca recursos aninhados em paralelo usando Promise.all()
- Banco de dados usa connection pooling para melhor performance
- Volumes Docker garantem persistência de dados entre reinicializações de containers

## Arquitetura

**Arquitetura de 3 Camadas:**
1. **Frontend (Cliente):** SPA React com roteamento client-side
2. **Backend (Aplicação):** API RESTful com estrutura inspirada em MVC
3. **Banco de Dados (Dados):** PostgreSQL para persistência

**Fluxo de Dados:**
```
Usuário → React (8080) → Express API (3000) → PostgreSQL (5432) / SWAPI
```

## Resolução de Problemas

**Containers não inicializam:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

**Problemas de conexão com banco de dados:**
- Certifique-se de que a porta 5432 não está em uso
- Verifique os logs do docker-compose: `docker-compose logs db`

**Frontend não carrega:**
- Certifique-se de que a porta 8080 não está em uso
- Verifique o console do navegador para erros
- Verifique REACT_APP_API_URL em web/.env

## Licença

Este projeto foi criado como um exercício take-home.