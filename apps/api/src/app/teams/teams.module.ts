import { CacheModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppConfigModule, BullConfigService } from '@api/config';
import { TeamsController } from '@api/teams/controllers';
import { TeamsService } from '@api/teams/providers';
import { API_ROOT_PATH } from '@api/teams/constants';

@Module({
  imports: [
    CacheModule.register(),
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: API_ROOT_PATH,
      imports: [AppConfigModule],
      useClass: BullConfigService,
    }),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
