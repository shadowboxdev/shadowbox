import { IRedisConfig } from './redis-config.interface';

export interface IAppConfig {
  orgBaseUri: string;
  projectName: string;
  wikiName: string;
  repo: string;
  devOpsToken: string;
  port: number;
  redis: IRedisConfig;
}
