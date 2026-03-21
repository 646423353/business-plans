import { Controller, Get, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { OAuthService } from './oauth.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Public()
  @Get('authorize')
  authorize(@Res() res: Response) {
    const state = this.oauthService.generateState();
    const authUrl = this.oauthService.getAuthorizationUrl(state);
    return res.redirect(authUrl);
  }

  @Public()
  @Get('callback')
  @HttpCode(HttpStatus.OK)
  async callback(@Query('code') code: string, @Query('state') state: string) {
    if (!code) {
      return {
        code: 400,
        message: 'Missing authorization code',
        data: null,
      };
    }

    const result = await this.oauthService.handleCallback(code, state);

    return {
      code: 200,
      message: 'OAuth login successful',
      data: result,
    };
  }
}
