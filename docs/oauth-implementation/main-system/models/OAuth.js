import { dbHelper } from '../config/database.js';
import crypto from 'crypto';

export class OAuthClient {
  static async findByClientId(clientId) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_clients WHERE client_id = ? AND is_active = 1',
      [clientId]
    );
    return rows[0] || null;
  }

  static async create(data) {
    const { clientId, clientSecret, name, redirectUris, scopes } = data;
    const [result] = await dbHelper.query(
      'INSERT INTO oauth_clients (client_id, client_secret, name, redirect_uris, scopes) VALUES (?, ?, ?, ?, ?)',
      [clientId, clientSecret, name, JSON.stringify(redirectUris), JSON.stringify(scopes)]
    );
    const [rows] = await dbHelper.query('SELECT * FROM oauth_clients WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async validateRedirectUri(client, redirectUri) {
    const uris = JSON.parse(client.redirect_uris || '[]');
    return uris.includes(redirectUri);
  }
}

export class OAuthCode {
  static async create(userId, clientId, redirectUri, scopes) {
    const code = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await dbHelper.query(
      'INSERT INTO oauth_codes (code, client_id, user_id, redirect_uri, scopes, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [code, clientId, userId, redirectUri, JSON.stringify(scopes), expiresAt]
    );
    return code;
  }

  static async findByCode(code) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_codes WHERE code = ? AND used = 0 AND expires_at > NOW()',
      [code]
    );
    return rows[0] || null;
  }

  static async markAsUsed(code) {
    await dbHelper.query('UPDATE oauth_codes SET used = 1 WHERE code = ?', [code]);
  }
}

export class OAuthToken {
  static async create(userId, clientId, scopes) {
    const accessToken = crypto.randomBytes(64).toString('hex');
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    
    await dbHelper.query(
      'INSERT INTO oauth_tokens (access_token, refresh_token, client_id, user_id, scopes, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [accessToken, refreshToken, clientId, userId, JSON.stringify(scopes), expiresAt]
    );
    
    return { accessToken, refreshToken, expiresAt };
  }

  static async findByAccessToken(accessToken) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_tokens WHERE access_token = ? AND expires_at > NOW()',
      [accessToken]
    );
    return rows[0] || null;
  }

  static async findByRefreshToken(refreshToken) {
    const [rows] = await dbHelper.query(
      'SELECT * FROM oauth_tokens WHERE refresh_token = ?',
      [refreshToken]
    );
    return rows[0] || null;
  }

  static async revoke(accessToken) {
    await dbHelper.query('DELETE FROM oauth_tokens WHERE access_token = ?', [accessToken]);
  }
}
