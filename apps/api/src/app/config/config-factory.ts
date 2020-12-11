import { FALLBACK_PORT, FALLBACK_TOKEN, REDIS_FALLBACK_HOST, REDIS_FALLBACK_PORT } from './constants';
import { IAppConfig } from './models';

export const configFactory = (): IAppConfig => ({
  orgBaseUri: 'https://dev.azure.com/360-view',
  projectName: 'OriginalPlatform',
  wikiName: 'Wiki',
  repo: 'wiki',
  devOpsToken: process.env.DEVOPS_TOKEN || FALLBACK_TOKEN,
  port: parseInt(process.env.PORT, 10) || FALLBACK_PORT,
  redis: {
    host: process.env.REDIS_HOST || REDIS_FALLBACK_HOST,
    port: parseInt(process.env.PORT, 10) || REDIS_FALLBACK_PORT,
  },
});
