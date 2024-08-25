import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Plunk from '@plunk/node';

@Injectable()
export class PlunkService {
  private plunk: Plunk;
  constructor(private configService: ConfigService) {
    this.plunk = new Plunk(this.configService.get('PLUNK_API_KEY'));
  }

  async sendEmail(receiver: string, subject: string, text: string) {
    try {
      const response = await this.plunk.emails.send({
        to: receiver,
        subject: subject,
        body: `<p>${text}</p>`,
      });
      return response;
    } catch (error) {
      Logger.error(`Failed to send email: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
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
      if (response.success) {
        success = true;
      }
      if (success) {
        return response;
      }
    }
    throw new Error('Failed to send email after retrying');
  }
}
