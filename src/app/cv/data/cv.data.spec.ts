import { describe, it, expect } from 'vitest';
import { CV } from './cv.data';

describe('CV data integrity', () => {
  it.each(['es', 'en'] as const)('has 4 experience entries in %s', (lang) => {
    expect(CV[lang].experience).toHaveLength(4);
  });

  it.each(['es', 'en'] as const)('every experience has company, role, period, and ≥1 bullet in %s', (lang) => {
    for (const exp of CV[lang].experience) {
      expect(exp.company).not.toBe('');
      expect(exp.role).not.toBe('');
      expect(exp.period).not.toBe('');
      expect(exp.bullets.length).toBeGreaterThanOrEqual(1);
    }
  });

  it.each(['es', 'en'] as const)('has 4 skills categories in %s', (lang) => {
    expect(CV[lang].skills).toHaveLength(4);
    for (const block of CV[lang].skills) {
      expect(block.items.length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(['es', 'en'] as const)('has 2 languages in %s', (lang) => {
    expect(CV[lang].languages).toHaveLength(2);
  });

  it.each(['es', 'en'] as const)('has header with name and ≥5 contact items in %s', (lang) => {
    expect(CV[lang].header.name).not.toBe('');
    expect(CV[lang].header.contact.length).toBeGreaterThanOrEqual(5);
  });

  it('shared structural parity between ES and EN', () => {
    expect(CV.es.experience.length).toBe(CV.en.experience.length);
    expect(CV.es.skills.length).toBe(CV.en.skills.length);
    expect(CV.es.languages.length).toBe(CV.en.languages.length);
    expect(CV.es.education.length).toBe(CV.en.education.length);
  });

  it('i18n content does not leak across languages', () => {
    expect(CV.es.summary).not.toBe(CV.en.summary);
    expect(CV.es.referencesNote).not.toBe(CV.en.referencesNote);
    expect(CV.es.experience[0].company).not.toBe(CV.en.experience[0].company);
  });
});
