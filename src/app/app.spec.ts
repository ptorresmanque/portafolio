import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { PROJECTS } from './data/projects';
import { TranslationService } from './i18n/translation.service';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('initializes TranslationService when App is created', () => {
    let creations = 0;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useFactory: () => {
            creations += 1;
            return { t: (key: string) => key };
          },
        },
      ],
    });
    TestBed.overrideComponent(App, { set: { template: '' } });

    TestBed.createComponent(App);

    expect(creations).toBe(1);
  });

  it('classifies projects correctly by kind', () => {
    const workProjects = PROJECTS.filter((p) => p.kind === 'work');
    const personalProjects = PROJECTS.filter((p) => p.kind === 'personal');

    expect(workProjects.map((p) => p.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
    ]);
    expect(personalProjects.map((p) => p.id)).toEqual(['cualautocompro-cl']);

    const cualauto = personalProjects[0];
    if (cualauto.kind === 'personal') {
      expect(cualauto.githubUrl).toBe('https://github.com/ptorresmanque/CualAutoCompro');
      expect(cualauto.siteUrl).toBe('https://cualautocompro.cl');
    }
  });

});
