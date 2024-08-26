import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { PlunkService } from './plunk.service';
import { PlunkRequestBody } from './plunk.model';
import { WriterService } from '../writer/writer.service';

@Controller('plunk')
export class PlunkController {
  constructor(
    @Inject(PlunkService) private readonly plunkService: PlunkService,
    @Inject(WriterService) private readonly writerService: WriterService,
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

  @Get('emails')
  async getEmails() {
    return this.writerService.getTrackOnlyFromPlunk();
  }
}
