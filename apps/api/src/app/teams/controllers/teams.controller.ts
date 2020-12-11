import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { API_ROOT_PATH } from '@api/teams/constants';
import { Team, Teams } from '../models/azure';
import { TeamsService } from '../providers';

const API_PATH: string = `${API_ROOT_PATH}`;

@ApiTags(API_PATH)
@Controller(API_PATH)
@UseInterceptors(CacheInterceptor)
export class TeamsController {
  constructor(private readonly _teams: TeamsService) {}

  @Get('/:projectId')
  @Header('Content-type', 'application/json')
  public async getProjects(
    @Param('projectId') projectId: string,
    @Res() res: Response<Teams>
  ): Promise<void> {
    const projects: Teams = await this._teams.getTeams(projectId);

    res.json(projects);
  }

  @Get('/:projectId/:teamId')
  @Header('Content-type', 'application/json')
  public async getProject(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId: string,
    @Res() res: Response<Team>
  ): Promise<void> {
    const project: Team = await this._teams.getTeam(projectId, teamId);

    res.json(project);
  }
}
