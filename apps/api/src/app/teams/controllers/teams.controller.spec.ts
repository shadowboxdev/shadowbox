import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [],
    }).compile();

    controller = app.get<TeamsController>(TeamsController);
  });

  describe('controller', () => {
    it('should create"', () => {
      expect(controller).toBeDefined();
    });
  });
});
