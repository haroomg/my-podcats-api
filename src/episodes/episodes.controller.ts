import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('episodes')
export class EpisodesController {
  @Get()
  findAll() {
    return 'all episodes';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    const ida: string = id;
    return { msm: `episode ${ida}` };
  }

  @Get('feature')
  findFeatured() {
    return 'featured episodes';
  }

  @Post()
  create(@Body() input: unknown) {
    console.log(input);
    return 'the episode was created';
  }
}
