import { Module } from '@nestjs/common';
import { WriterService } from './writer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WriterService],
})
export class WriterModule {}
