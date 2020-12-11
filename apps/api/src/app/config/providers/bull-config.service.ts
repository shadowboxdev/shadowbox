import { Injectable } from '@nestjs/common';
import { BullOptionsFactory, BullModuleOptions } from '@nestjs/bull';
import { AppConfigService } from './config.service';

@Injectable()
export class BullConfigService implements BullOptionsFactory {
  constructor(private readonly _config: AppConfigService) {}

  public createBullOptions(): BullModuleOptions {
    return this._config.redis;
  }
}
