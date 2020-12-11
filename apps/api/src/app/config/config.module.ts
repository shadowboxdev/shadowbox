import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configFactory } from './config-factory';
import { AppConfigService } from './providers/config.service';
import { BullConfigService } from './providers/bull-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFactory],
    }),
  ],
  controllers: [],
  providers: [AppConfigService, BullConfigService],
  exports: [AppConfigService, BullConfigService],
})
export class AppConfigModule {}
