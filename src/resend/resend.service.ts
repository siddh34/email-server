import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendResponse } from './resend.model';
import { CheckerService } from 'src/checker/checker.service';

@Injectable()
export class ResendService {
  resend: Resend;
  constructor(
    private configService: ConfigService,
    private checkerService: CheckerService,
  ) {
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
      Logger.error(`Failed to send email: ${error.message}`);
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
    if (!this.checkParams(receiver, subject, text)) {
      return {
        statusCode: 400,
        message: 'Invalid parameters',
      };
    }

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

    Logger.error('Failed to send email after retrying');
    throw new Error('Failed to send email after retrying');
  }

  checkParams(receiver: string, subject: string, text: string): boolean {
    if (!this.checkerService.checkIfStringIsEmail(receiver)) {
      return false;
    }

    if (
      !this.checkerService.emptyStringCheck(subject) ||
      !this.checkerService.emptyStringCheck(text)
    ) {
      return false;
    }

    return true;
  }
}
