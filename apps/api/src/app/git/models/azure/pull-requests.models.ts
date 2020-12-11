import { IdentityRef as PullRequestCommentLike } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import {
  GitPullRequestSearchCriteria,
  GitPullRequest,
  GitPullRequestCommentThread,
  Comment as PullRequestComment,
  GitCommitRef as GitCommit,
  GitPush,
  PullRequestStatus
} from 'azure-devops-node-api/interfaces/GitInterfaces';

type GitPullRequests = GitPullRequest[];

type GitPullRequestCommentThreads = GitPullRequestCommentThread[];

type PullRequestComments = PullRequestComment[];

type PullRequestCommentLikes = PullRequestCommentLike[];

type GitCommits = GitCommit[];

type GitPushes = GitPush[];

/** LEAVE AT BOTTOM */
export {
  GitPullRequestSearchCriteria,
  GitPullRequest,
  GitPullRequests,
  GitPullRequestCommentThread,
  GitPullRequestCommentThreads,
  PullRequestComment,
  PullRequestComments,
  PullRequestCommentLike,
  PullRequestCommentLikes,
  GitCommit,
  GitCommits,
  GitPush,
  GitPushes,
  PullRequestStatus,
};
