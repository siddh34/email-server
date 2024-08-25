import { Controller, Param, Post } from '@nestjs/common';

@Controller('resend')
export class ResendController {
  resendService: any;
  @Post('sendMail')
  async sendMail(
    @Param('reciever') reciever: string,
    @Param('subject') subject: string,
    @Param('message') message: string,
  ) {
    await this.resendService.sendEmail(reciever, subject, message);
  }
}
