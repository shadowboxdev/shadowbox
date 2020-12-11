import { BullModuleOptions } from '@nestjs/bull';

export interface IRedisConfig extends BullModuleOptions {
  host: string;
  port: number;
}
