import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CheckerService],
  exports: [CheckerService],
})
export class CheckerModule {}
