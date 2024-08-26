import { Test, TestingModule } from '@nestjs/testing';
import { ResendController } from './resend.controller';
import { ResendService } from './resend.service';
import { WriterService } from '../writer/writer.service';
import { ResendRequestBody } from './resend.model';

describe('resendController', () => {
  let resendController: ResendController;
  let resendService: ResendService;
  let writerService: WriterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResendController],
      providers: [
        {
          provide: ResendService,
          useValue: {
            retryEmail: jest.fn(),
          },
        },
        {
          provide: WriterService,
          useValue: {
            getTrackOnlyFromResend: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    resendController = module.get<ResendController>(ResendController);
    resendService = module.get<ResendService>(ResendService);
    writerService = module.get<WriterService>(WriterService);
  });

  describe('sendMail', () => {
    it('should send an email and return a success response', async () => {
      const body: ResendRequestBody = {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
        retry: 1,
      };
      jest.spyOn(resendService, 'retryEmail').mockResolvedValue({
        statusCode: 200,
        message: 'email sent successfully',
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resendController.sendMail(body, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('email sent successfully');
      expect(resendService.retryEmail).toHaveBeenCalledWith(
        body.receiver,
        body.subject,
        body.message,
        body.retry,
      );
    });

    it('should return a failure response', async () => {
      const body: ResendRequestBody = {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
        retry: 1,
      };
      jest.spyOn(resendService, 'retryEmail').mockResolvedValue({
        statusCode: 500,
        message: 'Failed to send email',
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resendController.sendMail(body, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to send email');
      expect(resendService.retryEmail).toHaveBeenCalledWith(
        body.receiver,
        body.subject,
        body.message,
        body.retry,
      );
    });
  });

  describe('getEmails', () => {
    it('should return an array of emails', async () => {
      const result = await resendController.getEmails();
      expect(result).toEqual([]);
      expect(writerService.getTrackOnlyFromResend).toHaveBeenCalled();
    });
  });
});
