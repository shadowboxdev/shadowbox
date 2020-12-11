import { Injectable, OnModuleInit } from '@nestjs/common';

import { AzureDevOpsService } from '@api/common';
import { AppConfigService } from '@api/config';
import { IGitApi, GitRepositories } from '../models/azure';

@Injectable()
export class RepositoriesService
  extends AzureDevOpsService
  implements OnModuleInit {
  private _git!: IGitApi;

  constructor(readonly config: AppConfigService) {
    super(config);
  }

  public async onModuleInit(): Promise<void> {
    this._git = await this._connection.getGitApi();
  }

  public async getRepositories(): Promise<GitRepositories> {
    return this._git.getRepositories(null, false, false);
  }
}
