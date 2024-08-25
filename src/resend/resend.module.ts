import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendService } from './resend.service';
import { ResendController } from './resend.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ResendController],
  providers: [ResendService],
})
export class ResendModule {}
