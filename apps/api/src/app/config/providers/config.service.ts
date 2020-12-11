import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys, IAppConfig, IRedisConfig } from '../models';

@Injectable()
export class AppConfigService implements IAppConfig {
  public get orgBaseUri(): string {
    return this._config.get<string>(ConfigKeys.OrgBaseUri);
  }

  public get port(): number {
    return this._config.get<number>(ConfigKeys.Port);
  }

  public get wikiName(): string {
    return this._config.get<string>(ConfigKeys.WikiName);
  }

  public get projectName(): string {
    return this._config.get<string>(ConfigKeys.ProjectName);
  }

  public get repo(): string {
    return this._config.get<string>(ConfigKeys.Repo);
  }

  public get devOpsToken(): string {
    return this._config.get<string>(ConfigKeys.DevOpsToken);
  }

  public get redis(): IRedisConfig {
    return this._config.get<IRedisConfig>(ConfigKeys.Redis);
  }

  constructor(private readonly _config: ConfigService) {}
}
