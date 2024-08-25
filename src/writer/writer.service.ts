import { Injectable } from '@nestjs/common';
import { Record } from './writer.model';
import fs from 'fs';

@Injectable()
export class WriterService {
  track: Record[];

  constructor() {
    this.loadTrack();
  }

  writeToFile(data: any): void {
    this.track.push(data);
    fs.writeFileSync(
      '../../mailTracker.json',
      JSON.stringify(this.track, null, 2),
    );
  }

  loadTrack(): void {
    this.track = JSON.parse(fs.readFileSync('../../mailTracker.json', 'utf-8'));
  }

  getTrack(): Record[] {
    return this.track;
  }

  clearTrack(): void {
    this.track = [];
    fs.writeFileSync('../../mailTracker.json', JSON.stringify([], null, 2));
  }

  checkLatestDuplicateEmail(
    receiver: string,
    subject: string,
    message: string,
  ): boolean {
    const latestEmail = this.track[this.track.length - 1];
    if (
      latestEmail.receiver === receiver &&
      latestEmail.subject === subject &&
      latestEmail.message === message
    ) {
      return true;
    }
    return false;
  }
}
