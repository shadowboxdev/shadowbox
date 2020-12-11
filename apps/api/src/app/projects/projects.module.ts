import { CacheModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppConfigModule, BullConfigService } from '@api/config';
import { ProjectsController } from '@api/projects/controllers';
import { ProjectsService } from '@api/projects/providers';
import { API_ROOT_PATH } from './constants';

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
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
