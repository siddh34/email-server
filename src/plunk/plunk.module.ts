import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlunkService } from './plunk.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PlunkService],
})
export class PlunkModule {}
