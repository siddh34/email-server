import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Plunk from '@plunk/node';
import { CheckerService } from 'src/checker/checker.service';
import { PlunkResponse } from './plunk.model';

@Injectable()
export class PlunkService {
  private plunk: Plunk;
  constructor(
    private configService: ConfigService,
    private checkerService: CheckerService,
  ) {
    this.plunk = new Plunk(this.configService.get('PLUNK_API_KEY'));
  }

  async sendEmail(
    receiver: string,
    subject: string,
    text: string,
  ): Promise<PlunkResponse> {
    try {
      const response = await this.plunk.emails.send({
        to: receiver,
        subject: subject,
        body: `<p>${text}</p>`,
      });
      return {
        statusCode: 200,
        message: `email sent successfully response from plunk: success: ${response.success}`,
      };
    } catch (error) {
      Logger.error(`Failed to send email: ${error.message}`);
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  async retryEmail(
    receiver: string,
    subject: string,
    text: string,
    retry: number = 1,
  ) {
    let success = false;
    for (let i = 0; i < retry; i++) {
      const response = await this.sendEmail(receiver, subject, text);
      if (response.statusCode === 200) {
        success = true;
      }
      if (success) {
        return response;
      }
    }
    throw new Error('Failed to send email after retrying');
  }
}
