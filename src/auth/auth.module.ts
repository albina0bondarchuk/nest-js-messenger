import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UserModule } from 'src/user/user.module';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [JwtModule.register({}), UserModule, DatabaseModule],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ]
})
export class AuthModule {}
