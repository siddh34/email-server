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

    return {
      message: 'Failed to send email after retrying',
      statusCode: 500,
    };
  }
}
