import axios from 'axios';
import crypto from 'crypto';
import { dbHelper } from '../config/database.js';

const OAUTH_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID || 'business-planner',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || 'bp-secret-key-2026-change-in-production',
  authorizeUrl: process.env.OAUTH_AUTHORIZE_URL || 'http://localhost:3001/oauth/authorize',
  tokenUrl: process.env.OAUTH_TOKEN_URL || 'http://localhost:3001/oauth/token',
  userinfoUrl: process.env.OAUTH_USERINFO_URL || 'http://localhost:3001/oauth/userinfo',
  redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback',
};

export class OAuthService {
  static generateState() {
    return crypto.randomBytes(32).toString('hex');
  }

  static getAuthorizeUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: OAUTH_CONFIG.clientId,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      state: state,
      scope: 'openid profile email'
    });
    
    return `${OAUTH_CONFIG.authorizeUrl}?${params.toString()}`;
  }

  static async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(OAUTH_CONFIG.tokenUrl, {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: OAUTH_CONFIG.redirectUri,
        client_id: OAUTH_CONFIG.clientId,
        client_secret: OAUTH_CONFIG.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Token exchange failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error_description || 'Token exchange failed');
    }
  }

  static async getUserInfo(accessToken) {
    try {
      const response = await axios.get(OAUTH_CONFIG.userinfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get userinfo failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error_description || 'Get userinfo failed');
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const response = await axios.post(OAUTH_CONFIG.tokenUrl, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: OAUTH_CONFIG.clientId,
        client_secret: OAUTH_CONFIG.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error_description || 'Token refresh failed');
    }
  }
}

export class OAuthBinding {
  static async findByProviderUserId(provider, providerUserId) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_bindings WHERE provider = ? AND provider_user_id = ?',
      [provider, providerUserId]
    );
    return rows[0] || null;
  }

  static async findByUserId(userId, provider) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_bindings WHERE user_id = ? AND provider = ?',
      [userId, provider]
    );
    return rows[0] || null;
  }

  static async create(data) {
    const { userId, provider, providerUserId, accessToken, refreshToken, expiresAt } = data;
    const [result] = await dbHelper.query(
      `INSERT INTO oauth_bindings (user_id, provider, provider_user_id, access_token, refresh_token, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, provider, providerUserId, accessToken, refreshToken, expiresAt]
    );
    const [rows] = await dbHelper.query('SELECT * FROM oauth_bindings WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async update(bindingId, data) {
    const fields = [];
    const values = [];
    
    if (data.accessToken !== undefined) {
      fields.push('access_token = ?');
      values.push(data.accessToken);
    }
    if (data.refreshToken !== undefined) {
      fields.push('refresh_token = ?');
      values.push(data.refreshToken);
    }
    if (data.expiresAt !== undefined) {
      fields.push('expires_at = ?');
      values.push(data.expiresAt);
    }
    
    if (fields.length > 0) {
      values.push(bindingId);
      await dbHelper.query(
        `UPDATE oauth_bindings SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    const [rows] = await dbHelper.query('SELECT * FROM oauth_bindings WHERE id = ?', [bindingId]);
    return rows[0];
  }
}
