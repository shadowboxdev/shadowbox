import { Test, TestingModule } from '@nestjs/testing';
import { GitController } from './git.controller';

describe('GitController', () => {
  let controller: GitController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GitController],
      providers: [],
    }).compile();

    controller = app.get<GitController>(GitController);
  });

  describe('controller', () => {
    it('should create"', () => {
      expect(controller).toBeDefined();
    });
  });
});
