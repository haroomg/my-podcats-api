import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ConfigService } from '../config/config.service';
import { IsPositivePipe } from 'src/pipes/is-positive.pipe';
import { ApiKeyGuard } from 'src/guards/api-key.guards';

@UseGuards(ApiKeyGuard)
@Controller('episodes')
export class EpisodesController {
  constructor(
    private episodeService: EpisodesService,
    private configService: ConfigService,
  ) {}

  @Get()
  findAll(
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe, IsPositivePipe)
    limit: number,
  ) {
    console.log(sort);
    return this.episodeService.findAll(sort, limit);
  }

  @Get('feature')
  findFeatured() {
    return this.episodeService.findFeatured();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log(id);
    const episode = await this.episodeService.findOne(id);
    if (!episode) {
      throw new NotFoundException('The episode was not found');
    }
    return episode;
  }

  @Post()
  create(@Body(ValidationPipe) input: CreateEpisodeDto) {
    console.log('One new episode was created.');
    console.log(input);
    return this.episodeService.create(input);
  }
}
