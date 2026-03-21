import { OAuthService, OAuthBinding } from '../services/oauthService.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const STATE_EXPIRY = 5 * 60 * 1000; // 5分钟
const stateStore = new Map();

/**
 * 获取授权URL
 * GET /api/auth/oauth/authorize-url
 */
export const getAuthorizeUrl = async (req, res) => {
  try {
    const state = OAuthService.generateState();
    
    stateStore.set(state, {
      createdAt: Date.now(),
      ip: req.ip
    });
    
    setTimeout(() => {
      stateStore.delete(state);
    }, STATE_EXPIRY);
    
    const url = OAuthService.getAuthorizeUrl(state);
    
    res.json({
      success: true,
      data: {
        url,
        state
      }
    });
  } catch (error) {
    console.error('Get authorize URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get authorize URL'
    });
  }
};

/**
 * OAuth回调处理
 * GET /api/auth/oauth/callback
 */
export const handleCallback = async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      const redirectUrl = new URL('/login', process.env.FRONTEND_URL || 'http://localhost:5173');
      redirectUrl.searchParams.set('error', error);
      redirectUrl.searchParams.set('error_description', error_description || 'OAuth authorization failed');
      return res.redirect(redirectUrl.toString());
    }

    const storedState = stateStore.get(state);
    if (!storedState) {
      const redirectUrl = new URL('/login', process.env.FRONTEND_URL || 'http://localhost:5173');
      redirectUrl.searchParams.set('error', 'invalid_state');
      redirectUrl.searchParams.set('error_description', 'Invalid or expired state parameter');
      return res.redirect(redirectUrl.toString());
    }
    
    stateStore.delete(state);

    if (Date.now() - storedState.createdAt > STATE_EXPIRY) {
      const redirectUrl = new URL('/login', process.env.FRONTEND_URL || 'http://localhost:5173');
      redirectUrl.searchParams.set('error', 'state_expired');
      redirectUrl.searchParams.set('error_description', 'State parameter has expired');
      return res.redirect(redirectUrl.toString());
    }

    const tokenData = await OAuthService.exchangeCodeForToken(code);
    const userInfo = await OAuthService.getUserInfo(tokenData.access_token);

    let binding = await OAuthBinding.findByProviderUserId('main_system', userInfo.sub);
    let user;

    if (binding) {
      user = await User.findById(binding.userId);
      
      await OAuthBinding.update(binding.id, {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
      });
    } else {
      let existingUser = await User.findByEmail(userInfo.email);
      
      if (existingUser) {
        user = existingUser;
      } else {
        user = await User.create({
          email: userInfo.email,
          username: userInfo.username,
          password: crypto.randomBytes(32).toString('hex'),
          avatar: userInfo.avatar
        });
      }
      
      await OAuthBinding.create({
        userId: user.id,
        provider: 'main_system',
        providerUserId: userInfo.sub,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
      });
    }

    const localToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    const redirectUrl = new URL('/dashboard', process.env.FRONTEND_URL || 'http://localhost:5173');
    redirectUrl.searchParams.set('token', localToken);
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    const redirectUrl = new URL('/login', process.env.FRONTEND_URL || 'http://localhost:5173');
    redirectUrl.searchParams.set('error', 'oauth_failed');
    redirectUrl.searchParams.set('error_description', error.message || 'OAuth login failed');
    res.redirect(redirectUrl.toString());
  }
};

/**
 * 刷新Token
 * POST /api/auth/oauth/refresh
 */
export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const newTokenData = await OAuthService.refreshToken(refresh_token);
    
    res.json({
      success: true,
      data: newTokenData
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Failed to refresh token'
    });
  }
};
