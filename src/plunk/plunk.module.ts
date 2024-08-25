import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlunkService } from './plunk.service';
import { CheckerModule } from 'src/checker/checker.module';
import { PlunkController } from './plunk.controller';

@Module({
  imports: [ConfigModule, CheckerModule],
  controllers: [PlunkController],
  providers: [PlunkService],
})
export class PlunkModule {}
