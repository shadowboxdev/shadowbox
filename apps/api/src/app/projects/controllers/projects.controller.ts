import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Param,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { API_ROOT_PATH } from '../constants';
import { TeamProject, TeamProjects } from '../models/azure';
import { ProjectsService } from '../providers';

const API_PATH: string = `${API_ROOT_PATH}`;

@ApiTags(API_PATH)
@Controller(API_PATH)
@UseInterceptors(CacheInterceptor)
export class ProjectsController {
  constructor(private readonly _projects: ProjectsService) {}

  @Get()
  @Header('Content-type', 'application/json')
  public async getProjects(
    @Res() res: Response<TeamProjects>
  ): Promise<void> {
    const projects: TeamProjects = await this._projects.getProjects();

    res.json(projects);
  }

  @Get('/:projectId')
  @Header('Content-type', 'application/json')
  public async getProject(
    @Param('projectId') projectId: string,
    @Res() res: Response<TeamProject>
  ): Promise<void> {
    const project: TeamProject = await this._projects.getProject(projectId);

    res.json(project);
  }
}
