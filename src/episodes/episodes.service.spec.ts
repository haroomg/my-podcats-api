import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesService } from './episodes.service';

describe('EpisodesService', () => {
  let service: EpisodesService;

  const mockEpisodesService: object = {
    findAll: async () => [{ id: 'id' }],
    findFeatureEpisodes: async () => [{ id: 'id' }],
    findOne: async () => ({ id: 'id' }),
    create: async () => ({ id: 'id' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EpisodesService,
          useValue: mockEpisodesService,
        },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
