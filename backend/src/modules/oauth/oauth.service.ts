import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface UserInfo {
  sub: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

@Injectable()
export class OAuthService {
  private readonly oauthConfig: OAuthConfig;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    const authUrl = this.configService.get<string>('oauth.authUrl');
    const tokenUrl = this.configService.get<string>('oauth.tokenUrl');
    const userinfoUrl = this.configService.get<string>('oauth.userinfoUrl');
    const redirectUri = this.configService.get<string>('oauth.redirectUri');
    
    console.log('OAuth Config - NODE_ENV:', process.env.NODE_ENV);
    console.log('OAuth Config - authUrl:', authUrl);
    console.log('OAuth Config - tokenUrl:', tokenUrl);
    console.log('OAuth Config - userinfoUrl:', userinfoUrl);
    console.log('OAuth Config - redirectUri:', redirectUri);
    
    this.oauthConfig = {
      clientId: this.configService.get<string>('oauth.clientId') || 'business-planner',
      clientSecret: this.configService.get<string>('oauth.clientSecret') || 'bp-secret-key-2026-change-in-production',
      authorizationUrl: authUrl || 'https://dashhub.insfair.cn/oauth/authorize',
      tokenUrl: tokenUrl || 'https://dashhub.insfair.cn/oauth/token',
      userInfoUrl: userinfoUrl || 'https://dashhub.insfair.cn/oauth/userinfo',
      redirectUri: redirectUri || 'https://cehua.insfair.cn/auth/callback',
    };
    
    console.log('OAuth Config - Final authorizationUrl:', this.oauthConfig.authorizationUrl);
    console.log('OAuth Config - Final tokenUrl:', this.oauthConfig.tokenUrl);
    console.log('OAuth Config - Final userInfoUrl:', this.oauthConfig.userInfoUrl);
  }

  generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.oauthConfig.clientId,
      redirect_uri: this.oauthConfig.redirectUri,
      scope: 'openid profile email',
      state: state,
    });

    return `${this.oauthConfig.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.oauthConfig.redirectUri,
        client_id: this.oauthConfig.clientId,
        client_secret: this.oauthConfig.clientSecret,
      });

      const response = await axios.post(
        this.oauthConfig.tokenUrl,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error('Token exchange failed:', error.response?.data || error.message);
      throw new UnauthorizedException('Failed to exchange authorization code');
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    try {
      const response = await axios.get(this.oauthConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Get user info failed:', error.response?.data || error.message);
      throw new UnauthorizedException('Failed to get user info');
    }
  }

  async findOrCreateUser(userInfo: UserInfo) {
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          username: userInfo.username,
          avatar: userInfo.avatar,
          role: 'free',
          passwordHash: crypto.randomBytes(32).toString('hex'),
        },
      });
    } else {
      if (userInfo.avatar && user.avatar !== userInfo.avatar) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { avatar: userInfo.avatar },
        });
      }
    }

    return user;
  }

  async generateLocalToken(userId: string, email: string, role: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }

  async handleCallback(code: string, state: string) {
    const tokenResponse = await this.exchangeCodeForToken(code);
    const userInfo = await this.getUserInfo(tokenResponse.access_token);
    const user = await this.findOrCreateUser(userInfo);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const localToken = await this.generateLocalToken(user.id, user.email, user.role);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: localToken,
    };
  }
}
