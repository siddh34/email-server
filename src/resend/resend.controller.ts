import { Controller, Inject, Body, Post } from '@nestjs/common';
import { ResendService } from './resend.service';
import { ResendRequestBody } from './resend.model';

@Controller('resend')
export class ResendController {
  constructor(
    @Inject(ResendService) private readonly resendService: ResendService,
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
}
