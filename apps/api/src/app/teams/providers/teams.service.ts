import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { AppConfigService } from '@api/config';
import { AzureDevOpsService } from '@api/common';
import { ICoreApi, Team, Teams } from '../models/azure';
import { API_ROOT_PATH } from '../constants';

@Injectable()
export class TeamsService extends AzureDevOpsService implements OnModuleInit {
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

  public async getTeam(projectId: string, teamId: string): Promise<Team> {
    return this._core.getTeam(projectId, teamId);
  }

  public async getTeams(projectId: string): Promise<Teams> {
    return this._core.getTeams(projectId);
  }
}
