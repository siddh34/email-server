import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendResponse } from './resend.model';
import { CheckerService } from 'src/checker/checker.service';
import { WriterService } from 'src/writer/writer.service';

@Injectable()
export class ResendService {
  resend: Resend;
  constructor(
    private configService: ConfigService,
    private checkerService: CheckerService,
    private writerService: WriterService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendEmail(
    receiver: string,
    subject: string,
    text: string,
  ): Promise<ResendResponse> {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
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

    Logger.log(`Email sent successfully: ${data}`);
    return {
      message: 'Email sent successfully',
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

    if (this.writerService.checkLatestDuplicateEmail(receiver, subject, text)) {
      return {
        statusCode: 200,
        message: 'Email already sent successfully',
      };
    }

    let success = false;
    for (let i = 0; i < retry; i++) {
      const response = await this.sendEmail(receiver, subject, text);
      if (response.statusCode === 200) {
        success = true;
      }

      if (success) {
        this.writerService.writeToFile({
          receiver,
          subject,
          message: text,
          isAttempting: false,
        });
        return response;
      } else {
        this.writerService.writeToFile({
          receiver,
          subject,
          message: text,
          isAttempting: true,
        });
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
      this.checkerService.emptyStringCheck(subject) ||
      this.checkerService.emptyStringCheck(text)
    ) {
      return false;
    }

    return true;
  }
}
