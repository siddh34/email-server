import { Controller, Inject, Body, Post, Get } from '@nestjs/common';
import { ResendService } from './resend.service';
import { ResendRequestBody } from './resend.model';
import { WriterService } from '../writer/writer.service';

@Controller('resend')
export class ResendController {
  constructor(
    @Inject(ResendService) private readonly resendService: ResendService,
    @Inject(WriterService) private readonly writerService: WriterService,
  ) {}

  @Post('sendMail')
  async sendMail(@Body() receivedBody: ResendRequestBody) {
    const res = await this.resendService.retryEmail(
      receivedBody.receiver,
      receivedBody.subject,
      receivedBody.message,
      receivedBody.retry,
    );
    return res;
  }

  @Get('emails')
  async getEmails() {
    return this.writerService.getTrackOnlyFromResend();
  }
}
