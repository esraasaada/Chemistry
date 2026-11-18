import { describe, expect, it } from 'vitest';
import { bank, isCorrect, solutionFor, topics } from './tutorScience';
import { record } from './tutorProgress';

describe('tutor question bank', () => {
  it('covers every lesson at all three levels without duplicate question IDs', () => {
    expect(new Set(bank.map(q => q.id)).size).toBe(bank.length);
    topics.forEach((_, topic) => {
      expect(new Set(bank.filter(q => q.topic === topic).map(q => q.level)).size).toBe(3);
    });
  });
  it('checks each localized choice against the same answer key', () => {
    for (const q of bank) {
      if (!q.choices) continue;
      expect(q.choices.filter(option => isCorrect(q, option[0]))).toHaveLength(1);
      for (const option of q.choices) expect(isCorrect(q, option[0])).toBe(isCorrect(q, option[1]));
    }
  });
  it('accepts Arabic numbers, spoken numbers and the expected unit without guessing from unrelated text', () => {
    const q = bank.find(question => question.id === 'titrate')!;
    expect(isCorrect(q, '١٠ مل')).toBe(true);
    expect(isCorrect(q, 'ten mL')).toBe(true);
    expect(isCorrect(q, '10 L')).toBe(false);
    expect(isCorrect(q, 'not 10')).toBe(false);
    expect(solutionFor(q, 'en')).toContain('0.10 × 20 ÷ 0.20');
  });
  it('credits an eventual correction once and retains the number of misses', () => {
    const q = bank[0];
    const missed = record({}, q, false, 4);
    const corrected = record(missed, q, true, 1);
    expect(record(corrected, q, true, 0)).toEqual({[q.id]: {correct:true,misses:5}});
  });
});
