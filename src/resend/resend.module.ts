import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendService } from './resend.service';
import { ResendController } from './resend.controller';
import { CheckerModule } from 'src/checker/checker.module';
import { WriterModule } from 'src/writer/writer.module';

@Module({
  imports: [ConfigModule, CheckerModule, WriterModule],
  controllers: [ResendController],
  providers: [ResendService],
})
export class ResendModule {}
