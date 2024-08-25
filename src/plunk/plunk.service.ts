import { Injectable } from '@nestjs/common';
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
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
