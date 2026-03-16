-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id VARCHAR(12) UNIQUE NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  shelby_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  password_hash VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_uploads_share_id ON uploads(share_id);
CREATE INDEX IF NOT EXISTS idx_uploads_expires_at ON uploads(expires_at);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);

-- Create stats table
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  total_uploads BIGINT DEFAULT 0,
  total_downloads BIGINT DEFAULT 0,
  total_bytes BIGINT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Initialize stats
INSERT INTO stats (total_uploads, total_downloads, total_bytes) 
VALUES (0, 0, 0)
ON CONFLICT DO NOTHING;

-- Function to increment upload stats
CREATE OR REPLACE FUNCTION increment_upload_stats(bytes BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE stats 
  SET 
    total_uploads = total_uploads + 1,
    total_bytes = total_bytes + bytes,
    updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- Function to increment download stats
CREATE OR REPLACE FUNCTION increment_download_stats()
RETURNS void AS $$
BEGIN
  UPDATE stats 
  SET 
    total_downloads = total_downloads + 1,
    updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired files (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS void AS $$
BEGIN
  DELETE FROM uploads WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
