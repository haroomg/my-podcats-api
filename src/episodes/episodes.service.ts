import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

// own import
import { Episode } from './entity/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';

@Injectable()
export class EpisodesService {
  private episodes: Episode[] = [];

  async findAll(sort: 'asc' | 'desc' = 'asc', limit: number) {
    const sortAsc = (a: Episode, b: Episode) => (a.name > b.name ? 1 : -1);
    const sortDesc = (a: Episode, b: Episode) => (a.name < b.name ? 1 : -1);

    const sortedEpisodes =
      sort === 'asc'
        ? this.episodes.sort(sortAsc)
        : this.episodes.sort(sortDesc);

    return sortedEpisodes.slice(0, limit);
  }

  async findFeatured() {
    return this.episodes.filter((episodes) => episodes.featured);
  }

  async findOne(id: string) {
    return this.episodes.find((episode) => episode.id === id);
  }

  async create(createEpisode: CreateEpisodeDto) {
    const newEpisode = { ...createEpisode, id: randomUUID() };
    this.episodes.push(newEpisode);

    return newEpisode;
  }
}
