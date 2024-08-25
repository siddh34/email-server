import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckerService {
  checkIfStringIsEmail(email: string): boolean {
    const flags = 'gm';
    const pattern = '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';
    const regexPattern = new RegExp(pattern, flags);
    return regexPattern.test(email);
  }

  emptyStringCheck(str: string): boolean {
    return str === '';
  }
}
