import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as oauthController from '../controllers/oauthController.js';

const router = express.Router();

// 授权端点 - 需要用户登录
router.get('/authorize', authMiddleware, oauthController.authorize);

// Token端点 - 不需要登录
router.post('/token', oauthController.token);

// 用户信息端点 - 通过Bearer Token验证
router.get('/userinfo', oauthController.userinfo);

export default router;
