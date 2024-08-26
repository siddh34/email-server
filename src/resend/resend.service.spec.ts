import { Test, TestingModule } from '@nestjs/testing';
import { ResendService } from './resend.service';
import { ConfigService } from '@nestjs/config';
import { CheckerService } from '../checker/checker.service';
import { WriterService } from '../writer/writer.service';
import { Resend } from 'resend';

jest.mock('resend');

describe('ResendService', () => {
  let resendService: ResendService;
  let resendInstanceMock: jest.Mocked<Resend>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('-api-key'),
          },
        },
        {
          provide: CheckerService,
          useValue: {
            checkIfStringIsEmail: jest.fn().mockReturnValue(true),
            emptyStringCheck: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: WriterService,
          useValue: {
            getTrackOnlyFromPlunk: jest.fn().mockResolvedValue([]),
            writeToFile: jest.fn(),
            checkLatestDuplicateEmail: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    resendService = module.get<ResendService>(ResendService);
    resendInstanceMock = new Resend('fake-api-key') as jest.Mocked<Resend>;

    Object.defineProperty(resendInstanceMock, 'emails', {
      value: {
        send: jest
          .fn()
          .mockImplementationOnce(() =>
            Promise.reject(new Error('First call failed')),
          )
          .mockResolvedValue({ data: 'success' }),
      },
    });

    resendService['resend'] = resendInstanceMock;
  });

  it('should be defined', () => {
    expect(resendService).toBeDefined();
  });

  it('should retry sending email on failure', async () => {
    const receiver = 'siddharth@gmail.com';
    const subject = 'Test Subject';
    const text = 'Test Message';
    const retry = 3;

    const result = await resendService.retryEmail(
      receiver,
      subject,
      text,
      retry,
    );

    expect(result).toEqual({
      statusCode: 200,
      message: 'Email sent successfully',
    });

    expect(resendInstanceMock.emails.send).toHaveBeenCalledTimes(2);
  });
});
