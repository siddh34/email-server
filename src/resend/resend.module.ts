import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendService } from './resend.service';
import { ResendController } from './resend.controller';
import { CheckerModule } from 'src/checker/checker.module';

@Module({
  imports: [ConfigModule, CheckerModule],
  controllers: [ResendController],
  providers: [ResendService],
})
export class ResendModule {}
