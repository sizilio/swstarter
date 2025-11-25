-- Queries table: stores all search queries
CREATE TABLE IF NOT EXISTS queries (
  id SERIAL PRIMARY KEY,
  search_term VARCHAR(255) NOT NULL,
  search_type VARCHAR(50) NOT NULL,
  results_count INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON queries(created_at);
CREATE INDEX IF NOT EXISTS idx_queries_search_term ON queries(search_term);

-- Statistics table: stores computed statistics
CREATE TABLE IF NOT EXISTS statistics (
  id SERIAL PRIMARY KEY,
  top_queries JSONB,
  avg_response_time NUMERIC(10, 2),
  most_popular_hour INTEGER,
  total_queries INTEGER DEFAULT 0,
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
