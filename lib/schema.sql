-- Devices table (for auth)
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  device_token VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Origami cache table (store AI results)
CREATE TABLE IF NOT EXISTS origami_cache (
  id SERIAL PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50),
  category VARCHAR(100),
  steps JSONB,
  source_url TEXT,
  thumbnail_url TEXT,
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(query)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_origami_query ON origami_cache(query);
CREATE INDEX IF NOT EXISTS idx_device_token ON devices(device_token);
