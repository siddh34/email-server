import { Test, TestingModule } from '@nestjs/testing';
import { CheckerService } from './checker.service';

describe('CheckerService', () => {
  let checkerService: CheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckerService],
    }).compile();

    checkerService = module.get<CheckerService>(CheckerService);
  });

  it('should be defined', () => {
    expect(checkerService).toBeDefined();
  });

  it('should validate email correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';
    expect(checkerService.checkIfStringIsEmail(validEmail)).toBe(true);
    expect(checkerService.checkIfStringIsEmail(invalidEmail)).toBe(false);
  });

  it('should check for empty string correctly', () => {
    const emptyString = '';
    const nonEmptyString = 'not empty';
    expect(checkerService.emptyStringCheck(emptyString)).toBe(true);
    expect(checkerService.emptyStringCheck(nonEmptyString)).toBe(false);
  });
});
