-- OAuth客户端表
CREATE TABLE IF NOT EXISTS oauth_clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id VARCHAR(64) NOT NULL UNIQUE,
  client_secret VARCHAR(128) NOT NULL,
  name VARCHAR(100) NOT NULL,
  redirect_uris TEXT NOT NULL,
  scopes TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_client_id (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OAuth授权码表
CREATE TABLE IF NOT EXISTS oauth_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(128) NOT NULL UNIQUE,
  client_id VARCHAR(64) NOT NULL,
  user_id INT NOT NULL,
  redirect_uri VARCHAR(500) NOT NULL,
  scopes TEXT,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OAuth Token表
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  access_token VARCHAR(128) NOT NULL UNIQUE,
  refresh_token VARCHAR(128) UNIQUE,
  client_id VARCHAR(64) NOT NULL,
  user_id INT NOT NULL,
  scopes TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_access_token (access_token),
  INDEX idx_refresh_token (refresh_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认客户端 (business-planner)
INSERT INTO oauth_clients (client_id, client_secret, name, redirect_uris, scopes)
VALUES (
  'business-planner',
  'bp-secret-key-2026-change-in-production',
  '商业策划机',
  '["http://localhost:5173/auth/callback","http://localhost:3000/auth/callback","https://planner.example.com/auth/callback"]',
  '["openid","profile","email"]'
) ON DUPLICATE KEY UPDATE name = VALUES(name);
