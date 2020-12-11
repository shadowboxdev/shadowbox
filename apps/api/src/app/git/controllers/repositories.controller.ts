import { CacheInterceptor, Controller, Get, Header, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GitRepositories } from '../models/azure';
import { RepositoriesService } from '../providers/repositories.service';

const API_PATH: string = 'repositories';

@ApiTags(API_PATH)
@Controller(API_PATH)
@UseInterceptors(CacheInterceptor)
export class RepositoriesController {
  constructor(private readonly _repositories: RepositoriesService) {}

  @Get()
  @Header('Content-type', 'application/json')
  public async getRepositories(
    @Res() res: Response<GitRepositories>
  ): Promise<void> {
    const repositories: GitRepositories = await this._repositories.getRepositories();

    res.json(repositories);
  }
}
