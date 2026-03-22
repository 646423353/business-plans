import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { ChatModule } from './modules/chat/chat.module';
import { DocumentModule } from './modules/document/document.module';
import { CaseModule } from './modules/case/case.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import configuration from './config/configuration';

const env = process.env.NODE_ENV || 'development';
const envFiles = env === 'production' 
  ? ['.env.production.local', '.env.production', '.env']
  : ['.env.local', '.env.development', '.env'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: envFiles,
    }),

    PrismaModule,

    AuthModule,
    UserModule,
    ProjectModule,
    ChatModule,
    DocumentModule,
    CaseModule,
    OAuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
