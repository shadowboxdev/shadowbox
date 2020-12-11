import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import {
  GitPullRequest,
  GitPullRequestCommentThread,
  GitPullRequestSearchCriteria,
  Comment,
  GitCommitRef,
  GitCommit,
  GitPush,
  IdentityRefWithVote,
} from 'azure-devops-node-api/interfaces/GitInterfaces';

import { AppConfigService } from '@api/config';
import { AzureDevOpsService } from '@api/common';
import { API_ROOT_PATH } from '../constants';

@Injectable()
export class PullRequestService
  extends AzureDevOpsService
  implements OnModuleInit {
  private _git!: IGitApi;

  constructor(
    @InjectQueue(API_ROOT_PATH) _queue: Queue,
    readonly config: AppConfigService
  ) {
    super(config, _queue);
  }

  public async onModuleInit(): Promise<void> {
    this._git = await this._connection.getGitApi();
  }

  public async getPullRequests(
    repositoryId: string,
    criteria: GitPullRequestSearchCriteria
  ): Promise<GitPullRequest[]> {
    return this._git.getPullRequests(repositoryId, criteria);
  }

  public async getPullRequest(
    repositoryId: string,
    pullRequestId: number
  ): Promise<GitPullRequest> {
    return this._git.getPullRequest(repositoryId, pullRequestId);
  }

  public async getThreads(
    repositoryId: string,
    pullRequestId: number
  ): Promise<GitPullRequestCommentThread[]> {
    return this._git.getThreads(repositoryId, pullRequestId);
  }

  public async getThread(
    repositoryId: string,
    pullRequestId: number,
    threadId: number
  ): Promise<GitPullRequestCommentThread> {
    return this._git.getPullRequestThread(
      repositoryId,
      pullRequestId,
      threadId
    );
  }

  public async getComments(
    repositoryId: string,
    pullRequestId: number,
    threadId: number
  ): Promise<Comment[]> {
    return this._git.getComments(repositoryId, pullRequestId, threadId);
  }

  public async getComment(
    repositoryId: string,
    pullRequestId: number,
    threadId: number,
    commentId: number
  ): Promise<Comment> {
    return this._git.getComment(
      repositoryId,
      pullRequestId,
      threadId,
      commentId
    );
  }

  public async getCommentLikes(
    repositoryId: string,
    pullRequestId: number,
    threadId: number,
    commentId: number
  ): Promise<IdentityRef[]> {
    return this._git.getLikes(repositoryId, pullRequestId, threadId, commentId);
  }

  public async getCommits(
    repositoryId: string,
    pullRequestId: number
  ): Promise<GitCommitRef[]> {
    return this._git.getPullRequestCommits(repositoryId, pullRequestId);
  }

  public async getCommit(
    repositoryId: string,
    commitId: string
  ): Promise<GitCommit> {
    return this._git.getCommit(commitId, repositoryId);
  }

  public async getPushes(repositoryId: string): Promise<GitPush[]> {
    return this._git.getPushes(repositoryId);
  }

  public async getPush(repositoryId: string, pushId: number): Promise<GitPush> {
    return this._git.getPush(repositoryId, pushId);
  }

  public async getReviewers(
    repositoryId: string,
    pullRequestId: number
  ): Promise<IdentityRefWithVote[]> {
    return this._git.getPullRequestReviewers(repositoryId, pullRequestId);
  }

  public async getReviewer(
    repositoryId: string,
    pullRequestId: number,
    reviewerId: string
  ): Promise<IdentityRefWithVote> {
    return this._git.getPullRequestReviewer(
      repositoryId,
      pullRequestId,
      reviewerId
    );
  }

  public async removeReviewer(
    repositoryId: string,
    pullRequestId: number,
    reviewerId: string
  ): Promise<void> {
    return this._git.deletePullRequestReviewer(
      repositoryId,
      pullRequestId,
      reviewerId
    );
  }

  public async addReviewer(
    reviewer: IdentityRefWithVote,
    repositoryId: string,
    pullRequestId: number,
    reviewerId: string
  ): Promise<IdentityRefWithVote> {
    return this._git.createPullRequestReviewer(
      reviewer,
      repositoryId,
      pullRequestId,
      reviewerId
    );
  }
}
