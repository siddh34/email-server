import { Test, TestingModule } from '@nestjs/testing';
import { PlunkController } from './plunk.controller';
import { PlunkService } from './plunk.service';
import { WriterService } from '../writer/writer.service';
import { PlunkRequestBody } from './plunk.model';

describe('PlunkController', () => {
  let plunkController: PlunkController;
  let plunkService: PlunkService;
  let writerService: WriterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlunkController],
      providers: [
        {
          provide: PlunkService,
          useValue: {
            retryEmail: jest.fn(),
          },
        },
        {
          provide: WriterService,
          useValue: {
            getTrackOnlyFromPlunk: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    plunkController = module.get<PlunkController>(PlunkController);
    plunkService = module.get<PlunkService>(PlunkService);
    writerService = module.get<WriterService>(WriterService);
  });

  describe('sendMail', () => {
    it('should send an email and return a success response', async () => {
      const body: PlunkRequestBody = {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
        retry: 1,
      };
      jest.spyOn(plunkService, 'retryEmail').mockResolvedValue({
        statusCode: 200,
        message: 'email sent successfully',
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await plunkController.sendMail(body, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('email sent successfully');
      expect(plunkService.retryEmail).toHaveBeenCalledWith(
        body.receiver,
        body.subject,
        body.message,
        body.retry,
      );
    });

    it('should return a failure response', async () => {
      const body: PlunkRequestBody = {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
        retry: 1,
      };
      jest.spyOn(plunkService, 'retryEmail').mockResolvedValue({
        statusCode: 500,
        message: 'Failed to send email',
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await plunkController.sendMail(body, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to send email');
      expect(plunkService.retryEmail).toHaveBeenCalledWith(
        body.receiver,
        body.subject,
        body.message,
        body.retry,
      );
    });
  });

  describe('getEmails', () => {
    it('should return an array of emails', async () => {
      const result = await plunkController.getEmails();
      expect(result).toEqual([]);
      expect(writerService.getTrackOnlyFromPlunk).toHaveBeenCalled();
    });
  });
});
