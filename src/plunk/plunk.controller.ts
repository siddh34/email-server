import { Controller, Inject, Param, Post } from '@nestjs/common';
import { PlunkService } from './plunk.service';

@Controller('plunk')
export class PlunkController {
  constructor(
    @Inject(PlunkService) private readonly plunkService: PlunkService,
  ) {}

  @Post('sendMail')
  async sendMail(
    @Param('reciever') reciever: string,
    @Param('subject') subject: string,
    @Param('message') message: string,
    @Param('retry') retry: number,
  ) {
    await this.plunkService.retryEmail(reciever, subject, message, retry);
  }
}
