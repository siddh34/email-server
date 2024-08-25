import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendResponse } from './resend.model';

@Injectable()
export class ResendService {
  resend: Resend;
  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendEmail(
    receiver: string,
    subject: string,
    text: string,
  ): Promise<ResendResponse> {
    const { data, error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: receiver,
      subject: subject,
      html: `<p>${text}</p>`,
    });

    if (error) {
      return {
        message: error.message,
        statusCode: 500,
      };
    }

    return {
      message: data.id,
      statusCode: 200,
    };
  }
}
