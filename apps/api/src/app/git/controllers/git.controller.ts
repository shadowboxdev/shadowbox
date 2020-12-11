import { CacheInterceptor, Controller, Get, Header, Query, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GetImageDto } from '../models';
import { GetImageDtoPipe } from '../pipes/get-image-dto.pipe';
import { GitService } from '../providers/git.service';

const API_PATH: string = 'git';

@ApiTags(API_PATH)
@Controller(API_PATH)
@UseInterceptors(CacheInterceptor)
export class GitController {
  constructor(private readonly _git: GitService) {}

  @Get('image')
  @Header('Content-type', 'image/png')
  @Header('Transfer-Encoding', 'chunked')
  public async getWikiImage(
    @Query(GetImageDtoPipe) dto: GetImageDto,
    @Res() res: Response
  ): Promise<void> {
    const imgStream = await this._git.getImage(dto);

    imgStream.pipe(res);
  }
}
