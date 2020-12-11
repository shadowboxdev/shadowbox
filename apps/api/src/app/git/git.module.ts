import { CacheModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppConfigModule, BullConfigService } from '@api/config';
import { GitController } from './controllers/git.controller';
import { PullRequestsController } from './controllers/pull-requests.controller';
import { RepositoriesController } from './controllers/repositories.controller';
import { GetImageDtoPipe } from './pipes/get-image-dto.pipe';
import { GitService } from './providers/git.service';
import { ImageService } from './providers/image.service';
import { PullRequestService } from './providers/pull-request.service';
import { RepositoriesService } from './providers/repositories.service';
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
  controllers: [GitController, RepositoriesController, PullRequestsController],
  providers: [
    GitService,
    PullRequestService,
    RepositoriesService,
    ImageService,
    GetImageDtoPipe,
  ],
})
export class GitModule {}
