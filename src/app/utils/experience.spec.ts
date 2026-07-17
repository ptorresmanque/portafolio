import { describe, expect, it } from 'vitest';
import { EXPERIENCE_START_YEAR, yearsOfExperience } from './experience';

describe('yearsOfExperience', () => {
  it('starts at year 2019', () => {
    expect(EXPERIENCE_START_YEAR).toBe(2019);
  });

  it('returns 7 in 2026', () => {
    expect(yearsOfExperience(new Date(2026, 6, 15))).toBe(7);
  });

  it('returns 8 in 2027', () => {
    expect(yearsOfExperience(new Date(2027, 0, 1))).toBe(8);
  });

  it('handles year boundary correctly', () => {
    expect(yearsOfExperience(new Date(2025, 11, 31, 23, 59, 59))).toBe(6);
    expect(yearsOfExperience(new Date(2026, 0, 1, 0, 0, 1))).toBe(7);
  });
});
