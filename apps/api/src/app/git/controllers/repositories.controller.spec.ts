import { Test, TestingModule } from '@nestjs/testing';

import { RepositoriesController } from './repositories.controller';

describe('RepositoriesController', () => {
  let controller: RepositoriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RepositoriesController],
      providers: [],
    }).compile();

    controller = app.get<RepositoriesController>(RepositoriesController);
  });

  describe('controller', () => {
    it('should create"', () => {
      expect(controller).toBeDefined();
    });
  });
});
