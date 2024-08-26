import { Controller, Inject, Body, Post, Get, Res } from '@nestjs/common';
import { ResendService } from './resend.service';
import { ResendRequestBody } from './resend.model';
import { WriterService } from '../writer/writer.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('resend')
@Controller('resend')
export class ResendController {
  constructor(
    @Inject(ResendService) private readonly resendService: ResendService,
    @Inject(WriterService) private readonly writerService: WriterService,
  ) {}

  @ApiResponse({ status: 201, description: 'Emailing operation performed' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  @Post('sendMail')
  async sendMail(
    @Body() receivedBody: ResendRequestBody,
    @Res() res: Response,
  ) {
    const response = await this.resendService.retryEmail(
      receivedBody.receiver,
      receivedBody.subject,
      receivedBody.message,
      receivedBody.retry,
    );
    return res.status(response.statusCode).send(response.message);
  }

  @ApiResponse({ status: 201, description: 'Fetched Emails' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('emails')
  async getEmails() {
    return this.writerService.getTrackOnlyFromResend();
  }
}
