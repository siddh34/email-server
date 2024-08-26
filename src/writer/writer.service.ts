import { Injectable } from '@nestjs/common';
import { Record } from './writer.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WriterService {
  track: Record[];

  constructor() {
    this.loadTrack();
  }

  writeToFile(data: any): void {
    this.track.push(data);
    fs.writeFileSync(
      path.resolve(__dirname, '../../mailTracker.json'),
      JSON.stringify(this.track, null, 2),
    );
  }

  loadTrack(): void {
    const filePath = path.resolve(__dirname, '../../mailTracker.json');
    if (fs.existsSync(filePath)) {
      this.track = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
      this.track = [];
    }
  }

  getTrack(): Record[] {
    return this.track;
  }

  clearTrack(): void {
    this.track = [];
    fs.writeFileSync(
      path.resolve(__dirname, '../../mailTracker.json'),
      JSON.stringify([], null, 2),
    );
  }

  getTrackOnlyFromResend(): Record[] {
    return this.track.filter((record) => record.from === 'resend');
  }

  getTrackOnlyFromPlunk(): Record[] {
    return this.track.filter((record) => record.from === 'plunk');
  }

  checkLatestDuplicateEmail(
    receiver: string,
    subject: string,
    message: string,
  ): boolean {
    const latestEmail = this.track[this.track.length - 1];

    if (!latestEmail) {
      return false;
    }

    if (
      latestEmail.receiver === receiver &&
      latestEmail.subject === subject &&
      latestEmail.message === message &&
      latestEmail.isAttempting === false &&
      latestEmail.status === 200
    ) {
      return true;
    }
    return false;
  }
}
