import { Controller, Inject, Param, Post } from '@nestjs/common';
import { ResendService } from './resend.service';

@Controller('resend')
export class ResendController {
  constructor(
    @Inject(ResendService) private readonly resendService: ResendService,
  ) {}

  @Post('sendMail')
  async sendMail(
    @Param('reciever') reciever: string,
    @Param('subject') subject: string,
    @Param('message') message: string,
    @Param('retry') retry: number,
  ) {
    await this.resendService.retryEmail(reciever, subject, message, retry);
  }
}
