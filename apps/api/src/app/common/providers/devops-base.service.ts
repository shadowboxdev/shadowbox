import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import * as azdev from 'azure-devops-node-api';
import { WebApi } from 'azure-devops-node-api';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import { AppConfigService } from '@api/config';

@Injectable()
export abstract class AzureDevOpsService {
  protected _authHandler: IRequestHandler;
  protected _connection: WebApi;

  protected get _orgBaseUri(): string {
    return this._config.orgBaseUri;
  }

  protected get _wikiName(): string {
    return this._config.orgBaseUri;
  }

  protected get _projectName(): string {
    return this._config.projectName;
  }

  protected get _repo(): string {
    return this._config.repo;
  }

  protected get _devOpsToken(): string {
    return this._config.devOpsToken;
  }

  protected get _encodedDevOpsToken(): string {
    return `Basic ${Buffer.from(`PAT:${this._devOpsToken}`).toString(
      'base64'
    )}`;
  }

  constructor(
    private readonly _config: AppConfigService,
    protected readonly _queue?: Queue
  ) {
    this._authHandler = azdev.getPersonalAccessTokenHandler(this._devOpsToken);
    this._connection = new azdev.WebApi(this._orgBaseUri, this._authHandler);
  }
}
