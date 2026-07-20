import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { CvComponent } from './cv.component';
import { CV } from './data/cv.data';
import { BehaviorSubject } from 'rxjs';

function setup(lang: 'es' | 'en') {
  const paramMap = new BehaviorSubject<{ get(key: string): string | null }>({
    get: (key: string) => (key === 'lang' ? lang : null),
  });
  const fakeRoute = {
    parent: {
      paramMap,
    },
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: ActivatedRoute, useValue: fakeRoute },
    ],
  });
  const fixture = TestBed.createComponent(CvComponent);
  fixture.detectChanges();
  return fixture;
}

describe('CvComponent', () => {
  it('renders the name from CV data in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.es.header.name);
  });

  it('renders the name from CV data in EN', () => {
    const fixture = setup('en');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.en.header.name);
  });

  it('renders summary section in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain(CV.es.summary.split('.')[0]);
  });

  it('renders all 4 experiences in EN', () => {
    const fixture = setup('en');
    const el = fixture.nativeElement as HTMLElement;
    for (const exp of CV.en.experience) {
      expect(el.textContent).toContain(exp.company);
    }
  });

  it('renders all 4 skills categories in ES', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    for (const block of CV.es.skills) {
      expect(el.textContent).toContain(block.category);
    }
  });

  it('renders 2 languages', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Español');
    expect(el.textContent).toContain('Inglés');
  });

  it('renders references note', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Referencias disponibles bajo petición');
  });

  it('contains anchor links for contact (mailto/tel/https)', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    const mailto = el.querySelector('a[href^="mailto:"]');
    const tel = el.querySelector('a[href^="tel:"]');
    const https = el.querySelector('a[href^="https://www.linkedin.com"]');
    expect(mailto).not.toBeNull();
    expect(tel).not.toBeNull();
    expect(https).not.toBeNull();
  });

  it('does not leak EN content in ES view', () => {
    const fixture = setup('es');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Apr 2022'); // fecha solo en EN
  });
});