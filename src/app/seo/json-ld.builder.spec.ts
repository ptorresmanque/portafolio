import { describe, expect, it } from 'vitest';
import { buildBreadcrumb, buildCreativeWork, buildPerson, buildWebSite } from './json-ld.builder';
import { PROJECTS } from '../data/projects';

describe('json-ld.builder', () => {
  it('buildPerson emits the canonical LinkedIn slug', () => {
    const json = buildPerson();
    expect(json['sameAs']).toContain('https://www.linkedin.com/in/patriciomanquepillan');
  });

  it('buildWebSite declares bilingual support with locale tags', () => {
    const json = buildWebSite();
    expect(json['inLanguage']).toEqual(['es-CL', 'en-US']);
  });

  it('buildPerson enumerates the stack in knowsAbout', () => {
    const json = buildPerson();
    const knows = json['knowsAbout'] as readonly string[];
    expect(knows).toContain('Angular');
    expect(knows).toContain('TypeScript');
    expect(knows).toContain('WCAG AA');
    expect(knows).toContain('Kubernetes');
    expect(knows).toContain('Spring Boot');
    expect(knows.length).toBeGreaterThanOrEqual(10);
  });

  it('buildCreativeWork uses temporalCoverage (year ranges) and points url at the projects section', () => {
    const project = PROJECTS[0];
    const json = buildCreativeWork(project);

    // Year ranges like "2019 — 2022" are not valid ISO 8601 dates; schema.org's
    // `dateCreated` expects an Instant / Date. Use `temporalCoverage` instead,
    // which is designed for time intervals including ranges.
    expect(json['dateCreated']).toBeUndefined();
    expect(json['temporalCoverage']).toBe(project.year);

    // The SPA has no per-project anchor; point every work at the projects
    // section so the URL actually resolves.
    expect(json['url']).toBe('https://patriciomanquepillan.com/#proyectos');
  });

  it('buildCreativeWork attaches the review for work projects that have a letter', () => {
    const json = buildCreativeWork(PROJECTS[0]);
    const review = json['review'] as Record<string, unknown>;
    expect(review).toBeTruthy();
    expect(review['@type']).toBe('Review');
  });

  it('buildCreativeWork skips the review for projects without a letter', () => {
    const json = buildCreativeWork(PROJECTS[2]); // Comunidad de Madrid — no letter
    expect(json['review']).toBeUndefined();
  });

  it('buildCreativeWork omits the review for personal projects', () => {
    const personal = PROJECTS.find((p) => p.kind === 'personal')!;
    const json = buildCreativeWork(personal);
    expect(json['review']).toBeUndefined();
  });

  it('buildBreadcrumb returns null (home-only breadcrumbs add no signal)', () => {
    // A single-item breadcrumb pointing at the home page is noise: the WebSite
    // schema already covers it, and Google has flagged the pattern as
    // misleading. Returning null keeps the build wiring simple while the
    // document is suppressed at the caller.
    expect(buildBreadcrumb()).toBeNull();
  });
});