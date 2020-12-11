import {
  CacheInterceptor,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { JoiValidationPipe, guidSchema } from '@api/common';
import {
  GitCommit,
  GitCommits,
  GitPullRequest,
  GitPullRequestCommentThread,
  GitPullRequestCommentThreads,
  GitPullRequests,
  GitPush,
  GitPushes,
  PullRequestComment,
  PullRequestCommentLikes,
  PullRequestComments,
} from '../models/azure';
import { PullRequestService } from '../providers/pull-request.service';
import { PullRequestSearchCriteriaDto } from '../models';

const API_PATH: string = 'pullRequests';

const guidValidator = new JoiValidationPipe(guidSchema);
const asNumber = new ParseIntPipe();

@ApiTags(API_PATH)
@Controller(API_PATH)
@UseInterceptors(CacheInterceptor)
export class PullRequestsController {
  constructor(private readonly _git: PullRequestService) {}

  @Get('/:repositoryId')
  @ApiOperation({ summary: 'Get all pull requests for a given repository id' })
  @ApiResponse({
    status: 200,
    description: 'The found pull requests',
  })
  @ApiQuery({
    name: 'searchCriteria',
    type: PullRequestSearchCriteriaDto,
  })
  @Header('Content-type', 'application/json')
  public async getPullRequests(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Query() criteria: PullRequestSearchCriteriaDto,
    @Res() res: Response<GitPullRequests>
  ): Promise<void> {
    const pullRequests: GitPullRequests = await this._git.getPullRequests(
      repositoryId,
      criteria
    );

    res.json(pullRequests);
  }

  @Get('/:repositoryId/:pullRequestId')
  @Header('Content-type', 'application/json')
  public async getPullRequest(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Res() res: Response<GitPullRequest>
  ): Promise<void> {
    const pullRequest: GitPullRequest = await this._git.getPullRequest(
      repositoryId,
      pullRequestId
    );

    res.json(pullRequest);
  }

  @Get('threads/:repositoryId/:pullRequestId')
  @Header('Content-type', 'application/json')
  public async getThreads(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Res() res: Response<GitPullRequestCommentThreads>
  ): Promise<void> {
    const threads: GitPullRequestCommentThreads = await this._git.getThreads(
      repositoryId,
      pullRequestId
    );

    res.json(threads);
  }

  @Get('threads/:repositoryId/:pullRequestId/:threadId')
  @Header('Content-type', 'application/json')
  public async getThread(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Param('threadId') number: number,
    @Res() res: Response<GitPullRequestCommentThread>
  ): Promise<void> {
    const thread: GitPullRequestCommentThread = await this._git.getThread(
      repositoryId,
      pullRequestId,
      number
    );

    res.json(thread);
  }

  @Get('threads/:repositoryId/:pullRequestId/:threadId/comments')
  @Header('Content-type', 'application/json')
  public async getComments(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Param('threadId', asNumber) threadId: number,
    @Res() res: Response<PullRequestComments>
  ): Promise<void> {
    const comments: PullRequestComments = await this._git.getComments(
      repositoryId,
      pullRequestId,
      threadId
    );

    res.json(comments);
  }

  @Get('threads/:repositoryId/:pullRequestId/:threadId/comments/:commentId')
  @Header('Content-type', 'application/json')
  public async getComment(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', guidValidator) pullRequestId: number,
    @Param('threadId', asNumber) threadId: number,
    @Param('commentId', asNumber) commentId: number,
    @Res() res: Response<PullRequestComment>
  ): Promise<void> {
    const comment: PullRequestComment = await this._git.getComment(
      repositoryId,
      pullRequestId,
      threadId,
      commentId
    );

    res.json(comment);
  }

  @Get(
    'threads/:repositoryId/:pullRequestId/:threadId/comments/:commentId/likes'
  )
  @Header('Content-type', 'application/json')
  public async getCommentLikes(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Param('threadId', asNumber) threadId: number,
    @Param('commentId', asNumber) commentId: number,
    @Res() res: Response<PullRequestCommentLikes>
  ): Promise<void> {
    const likes: PullRequestCommentLikes = await this._git.getCommentLikes(
      repositoryId,
      pullRequestId,
      threadId,
      commentId
    );

    res.json(likes);
  }

  @Get('/:repositoryId/commits/:pullRequestId')
  @Header('Content-type', 'application/json')
  public async getCommits(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pullRequestId', asNumber) pullRequestId: number,
    @Res() res: Response<GitCommits>
  ): Promise<void> {
    const commits: GitCommits = await this._git.getCommits(
      repositoryId,
      pullRequestId
    );

    res.json(commits);
  }

  @Get('/:repositoryId/commits/:commitId')
  @Header('Content-type', 'application/json')
  public async getCommit(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('commitId', guidValidator) commitId: string,
    @Res() res: Response<GitCommit>
  ): Promise<void> {
    const commit: GitCommit = await this._git.getCommit(repositoryId, commitId);

    res.json(commit);
  }

  @Get('/:repositoryId/pushes')
  @Header('Content-type', 'application/json')
  public async getPushes(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Res() res: Response<GitPushes>
  ): Promise<void> {
    const pushes: GitPushes = await this._git.getPushes(repositoryId);

    res.json(pushes);
  }

  @Get('/:repositoryId/pushes/:pushId')
  @Header('Content-type', 'application/json')
  public async getPush(
    @Param('repositoryId', guidValidator) repositoryId: string,
    @Param('pushId', asNumber) pushId: number,
    @Res() res: Response<GitPush>
  ): Promise<void> {
    const push: GitPush = await this._git.getPush(repositoryId, pushId);

    res.json(push);
  }
}
