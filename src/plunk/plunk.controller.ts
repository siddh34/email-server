import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PlunkService } from './plunk.service';
import { PlunkRequestBody } from './plunk.model';

@Controller('plunk')
export class PlunkController {
  constructor(
    @Inject(PlunkService) private readonly plunkService: PlunkService,
  ) {}

  @Post('sendMail')
  async sendMail(@Body() recievedBody: PlunkRequestBody) {
    const res = await this.plunkService.retryEmail(
      recievedBody.receiver,
      recievedBody.subject,
      recievedBody.message,
      recievedBody.retry,
    );
    return res;
  }
}
