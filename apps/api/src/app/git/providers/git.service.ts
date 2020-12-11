import { Injectable, OnModuleInit } from '@nestjs/common';
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { GitItem } from 'azure-devops-node-api/interfaces/GitInterfaces';

import { AzureDevOpsService } from '@api/common';
import { AppConfigService } from '@api/config';
import { GetImageDto } from '../models';
import { ImageService } from './image.service';

@Injectable()
export class GitService extends AzureDevOpsService implements OnModuleInit {
  private _git!: IGitApi;

  constructor(
    private readonly _image: ImageService,
    readonly config: AppConfigService
  ) {
    super(config);
  }

  public async onModuleInit(): Promise<void> {
    this._git = await this._connection.getGitApi();
  }

  public async getImage(dto: GetImageDto): Promise<NodeJS.ReadableStream> {
    const { _projectName, _repo } = this;
    const { path, filename, resize } = dto;

    const { objectId } = await this.getItem(path);
    const imageStream = await this._git.getBlobContent(
      _repo,
      objectId,
      _projectName,
      true,
      filename
    );

    if (resize) {
      return this._image.resize(imageStream, dto);
    }

    return imageStream;
  }

  public async getItem(path: string): Promise<GitItem> {
    const { _repo, _projectName } = this;

    return this._git.getItem(
      _repo,
      path,
      _projectName,
      null,
      null,
      true,
      true,
      false,
      null,
      true,
      false,
      true
    );
  }
}
