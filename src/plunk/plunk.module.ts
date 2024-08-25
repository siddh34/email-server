import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlunkService } from './plunk.service';
import { CheckerModule } from 'src/checker/checker.module';
import { PlunkController } from './plunk.controller';
import { WriterModule } from 'src/writer/writer.module';

@Module({
  imports: [ConfigModule, CheckerModule, WriterModule],
  controllers: [PlunkController],
  providers: [PlunkService],
})
export class PlunkModule {}
