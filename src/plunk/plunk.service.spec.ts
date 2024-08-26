import { Test, TestingModule } from '@nestjs/testing';
import { PlunkService } from './plunk.service';
import { WriterService } from '../writer/writer.service';
import { CheckerService } from '../checker/checker.service';
import Plunk from '@plunk/node';
import { ConfigService } from '@nestjs/config';
jest.mock('@plunk/node');

describe('CheckerService', () => {
  let plunkService: PlunkService;
  let plunkMock: jest.Mocked<typeof Plunk>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlunkService,
        {
          provide: WriterService,
          useValue: {
            getTrackOnlyFromPlunk: jest.fn().mockResolvedValue([]),
            writeToFile: jest.fn(),
            checkLatestDuplicateEmail: jest.fn().mockReturnValue(false),
          },
        },
        CheckerService,
        ConfigService,
      ],
    }).compile();

    plunkService = module.get<PlunkService>(PlunkService);
    plunkMock = Plunk as jest.Mocked<typeof Plunk>;

    plunkMock.prototype.emails = {
      send: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new Error('First call failed')),
        )
        .mockResolvedValue({ success: true }),
    };

    plunkService['plunk'] = new plunkMock('');
  });

  it('should be defined', () => {
    expect(plunkService).toBeDefined();
  });

  it('it should test retry', async () => {
    const receiver = 'siddharth@gmail.com';
    const subject = 'Test Subject';
    const message = 'Test Message';
    const retry = 3;

    const result = await plunkService.retryEmail(
      receiver,
      subject,
      message,
      retry,
    );
    expect(result).toEqual({
      statusCode: 200,
      message: 'email sent successfully response from plunk: success: true',
    });

    expect(plunkMock.prototype.emails.send).toHaveBeenCalled();
  });
});
