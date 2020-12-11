import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { AppConfigService } from '@api/config';
import { AzureDevOpsService } from '@api/common';
import { TeamProject, TeamProjects, ICoreApi } from '../models/azure';
import { API_ROOT_PATH } from '../constants';

@Injectable()
export class ProjectsService
  extends AzureDevOpsService
  implements OnModuleInit {
  private _core!: ICoreApi;

  constructor(
    @InjectQueue(API_ROOT_PATH) _queue: Queue,
    readonly config: AppConfigService
  ) {
    super(config, _queue);
  }

  public async onModuleInit(): Promise<void> {
    this._core = await this._connection.getCoreApi();
  }

  public async getProject(projectId: string): Promise<TeamProject> {
    return this._core.getProject(projectId);
  }

  public async getProjects(): Promise<TeamProjects> {
    return this._core.getProjects();
  }
}
