import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';

describe('datetime preservation', () => {
  it('parses DB wall-clock string and preserves hour', () => {
    const dbString = '2026-01-23T08:30:00'; // DB wall-clock string (no timezone Z)
    const parsed = dayjs(dbString);
    const formatted = parsed.format('YYYY-MM-DDTHH:mm:ss');

    expect(formatted).toBe(dbString);
    expect(parsed.format('HH:mm')).toBe('08:30');
  });

  it('duration calculation from DB strings is correct', () => {
    const start = dayjs('2026-01-23T06:00:00');
    const end = dayjs('2026-01-23T07:30:00');
    const diffHours = (end.valueOf() - start.valueOf()) / (1000 * 60 * 60);
    expect(diffHours).toBeCloseTo(1.5);
  });
});