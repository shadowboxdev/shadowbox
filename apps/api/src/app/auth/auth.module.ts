import { CacheModule, Module } from '@nestjs/common';

import { AppConfigModule } from '@api/config';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './services/google.strategy';
import { JwtStrategy } from './services/jwt.strategy';

@Module({
  imports: [
    CacheModule.register(),
    AppConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
