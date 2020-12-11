import { ApiProperty } from '@nestjs/swagger';

import { getEnumKeys } from '@api/common';

import {
  GitPullRequestSearchCriteria as SearchCriteria,
  PullRequestStatus,
} from './azure';

export class PullRequestSearchCriteriaDto implements SearchCriteria {
  @ApiProperty({
    name: 'status',
    type: PullRequestStatus,
    required: true,
    example: 'Active',
    enum: getEnumKeys(PullRequestStatus),
    enumName: 'PullRequestStatus',
    description:
      'If set, search for pull requests that are in this state. Defaults to Active if unset',
  })
  public status?: PullRequestStatus;

  @ApiProperty({
    name: 'creatorId',
    type: String,
    required: false,
    description:
      'If set, search for pull requests that were created by this identity.',
  })
  public creatorId?: string;

  @ApiProperty({
    name: 'includeLinks',
    type: Boolean,
    example: false,
    required: false,
    description:
      'Whether to include the _links field on the shallow references',
  })
  public includeLinks?: boolean;

  @ApiProperty({
    name: 'repositoryId',
    type: String,
    required: false,
    description:
      'If set, search for pull requests whose target branch is in this repository',
  })
  public repositoryId?: string;

  @ApiProperty({
    name: 'reviewerId',
    type: String,
    required: false,
    description:
      'If set, search for pull requests that have this identity as a reviewer',
  })
  public reviewerId?: string;

  @ApiProperty({
    name: 'sourceRefName',
    type: String,
    required: false,
    description: 'If set, search for pull requests from this branch.',
  })
  public sourceRefName?: string;

  @ApiProperty({
    name: 'sourceRepositoryId',
    type: String,
    required: false,
    description:
      'If set, search for pull requests whose source branch is in this repository',
  })
  public sourceRepositoryId?: string;

  @ApiProperty({
    name: 'targetRefName',
    type: String,
    required: false,
    description: 'If set, search for pull requests into this branch',
  })
  public targetRefName?: string;
}
