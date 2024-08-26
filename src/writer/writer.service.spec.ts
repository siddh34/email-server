import { WriterService } from './writer.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('WriterService', () => {
  let writerService: WriterService;
  const mockFilePath = path.resolve(__dirname, '../../mailTracker.json');

  beforeEach(() => {
    jest.clearAllMocks();
    writerService = new WriterService();
  });

  it('should initialize with an empty track if file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    writerService.loadTrack();
    expect(writerService.track).toEqual([]);
  });

  it('should load track from file if it exists', () => {
    const mockData = [{ receiver: 'test@example.com', from: 'resend' }];
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));
    writerService.loadTrack();
    expect(writerService.track).toEqual(mockData);
  });

  it('should write data to file', () => {
    const data = { receiver: 'test@example.com', from: 'resend' };
    writerService.writeToFile(data);
    expect(writerService.track).toContain(data);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockFilePath,
      JSON.stringify([data, data], null, 2),
    );
  });

  it('should return the track', () => {
    const data = {
      receiver: 'test@example.com',
      from: 'resend',
      isAttempting: false,
      message: 'hi',
      retry: 2,
      subject: 'hi',
      sentTime: new Date(),
      status: 200,
    };
    writerService.track = [data];
    expect(writerService.getTrack()).toEqual([data]);
  });

  it('should clear the track and write to file', () => {
    writerService.clearTrack();
    expect(writerService.track).toEqual([]);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockFilePath,
      JSON.stringify([], null, 2),
    );
  });

  it('should return only records from resend', () => {
    const data = [
      {
        receiver: 'test1@example.com',
        from: 'resend',
        isAttempting: false,
        message: 'hi',
        retry: 2,
        subject: 'hi',
        sentTime: new Date(),
        status: 200,
      },
      {
        receiver: 'test2@example.com',
        from: 'plunk',
        isAttempting: false,
        message: 'hi',
        retry: 2,
        subject: 'hi',
        sentTime: new Date(),
        status: 200,
      },
    ];
    writerService.track = data;
    expect(writerService.getTrackOnlyFromResend()).toEqual([data[0]]);
  });

  it('should return only records from plunk', () => {
    const data = [
      {
        receiver: 'test1@example.com',
        from: 'resend',
        isAttempting: false,
        message: 'hi',
        retry: 2,
        subject: 'hi',
        sentTime: new Date(),
        status: 200,
      },
      {
        receiver: 'test2@example.com',
        from: 'plunk',
        isAttempting: false,
        message: 'hi',
        retry: 2,
        subject: 'hi',
        sentTime: new Date(),
        status: 200,
      },
    ];
    writerService.track = data;
    expect(writerService.getTrackOnlyFromPlunk()).toEqual([data[1]]);
  });

  it('should check for latest duplicate email', () => {
    const data = [
      {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        from: 'plunk',
        message: 'Test Message',
        isAttempting: false,
        retry: 2,
        sentTime: new Date(),
        status: 200,
      },
    ];
    writerService.track = data;
    expect(
      writerService.checkLatestDuplicateEmail(
        'test@example.com',
        'Test Subject',
        'Test Message',
      ),
    ).toBe(true);
  });

  it('should return false if no latest email', () => {
    writerService.track = [];
    expect(
      writerService.checkLatestDuplicateEmail(
        'test@example.com',
        'Test Subject',
        'Test Message',
      ),
    ).toBe(false);
  });

  it('should return false if latest email does not match', () => {
    const data = [
      {
        receiver: 'test@example.com',
        subject: 'Test Subject',
        message: 'Different Message',
        isAttempting: false,
        retry: 2,
        sentTime: new Date(),
        status: 200,
        from: 'plunk',
      },
    ];
    writerService.track = data;
    expect(
      writerService.checkLatestDuplicateEmail(
        'test@example.com',
        'Test Subject',
        'Test Message',
      ),
    ).toBe(false);
  });
});
