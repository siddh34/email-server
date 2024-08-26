import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { PlunkService } from './plunk.service';
import { PlunkRequestBody } from './plunk.model';
import { WriterService } from '../writer/writer.service';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('plunk')
@Controller('plunk')
export class PlunkController {
  constructor(
    @Inject(PlunkService) private readonly plunkService: PlunkService,
    @Inject(WriterService) private readonly writerService: WriterService,
  ) {}

  @ApiResponse({ status: 201, description: 'Emailing operation performed' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  @Post('sendMail')
  async sendMail(@Body() recievedBody: PlunkRequestBody, @Res() res: Response) {
    const response = await this.plunkService.retryEmail(
      recievedBody.receiver,
      recievedBody.subject,
      recievedBody.message,
      recievedBody.retry,
    );
    return res.status(response.statusCode).send(response.message);
  }

  @ApiResponse({ status: 201, description: 'Fetched Emails' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('emails')
  async getEmails() {
    return this.writerService.getTrackOnlyFromPlunk();
  }
}
