import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [],
    }).compile();

    controller = app.get<ProjectsController>(ProjectsController);
  });

  describe('controller', () => {
    it('should create"', () => {
      expect(controller).toBeDefined();
    });
  });
});
