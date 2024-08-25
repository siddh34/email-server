import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlunkService } from './plunk.service';
import { CheckerModule } from 'src/checker/checker.module';

@Module({
  imports: [ConfigModule, CheckerModule],
  controllers: [],
  providers: [PlunkService],
})
export class PlunkModule {}
