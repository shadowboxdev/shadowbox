import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsController } from './pull-requests.controller';

describe('PullRequestsController', () => {
  let controller: PullRequestsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PullRequestsController],
      providers: [],
    }).compile();

    controller = app.get<PullRequestsController>(PullRequestsController);
  });

  describe('controller', () => {
    it('should create"', () => {
      expect(controller).toBeDefined();
    });
  });
});
