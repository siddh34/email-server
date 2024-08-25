import { Controller, Param, Post } from '@nestjs/common';
import { ResendService } from './resend.service';

@Controller('resend')
export class ResendController {
  resendServices: ResendService;

  constructor(private resendService: ResendService) {
    this.resendServices = resendService;
  }

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
