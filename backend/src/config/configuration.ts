export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  ai: {
    apiKey: process.env.SILICONFLOW_API_KEY || '',
    baseUrl: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
    model: process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct',
  },
  quota: {
    freeDailyLimit: parseInt(process.env.QUOTA_FREE_DAILY_LIMIT || '1', 10),
    proDailyLimit: parseInt(process.env.QUOTA_PRO_DAILY_LIMIT || '10', 10),
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID || 'business-planner',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || 'bp-secret-key-2026-change-in-production',
    authUrl: process.env.OAUTH_AUTH_URL || 'http://localhost:5174/oauth/authorize',
    tokenUrl: process.env.OAUTH_TOKEN_URL || 'http://localhost:3001/oauth/token',
    userinfoUrl: process.env.OAUTH_USERINFO_URL || 'http://localhost:3001/oauth/userinfo',
    redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  },
});
