import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
