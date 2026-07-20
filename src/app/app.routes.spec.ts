import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES } from './app.routes';
import { CvComponent } from './cv/cv.component';
import { CV } from './cv/data/cv.data';
import { HomePage } from './pages/home/home.page';

describe('APP_ROUTES', () => {
  let preconnect: HTMLLinkElement;

  beforeEach(() => {
    preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://images.unsplash.com';
    document.head.append(preconnect);
  });

  afterEach(() => {
    preconnect.remove();
  });

  it('loads the portfolio home page at the root route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(APP_ROUTES)] });
    const harness = await RouterTestingHarness.create();

    const component = await harness.navigateByUrl('/', HomePage);

    expect(component).toBeInstanceOf(HomePage);
  });

  it.each([
    ['/es/cv', CV.es.header.name],
    ['/en/cv', CV.en.header.name],
  ])('loads the localized CV at %s', async (url, expectedName) => {
    TestBed.configureTestingModule({ providers: [provideRouter(APP_ROUTES)] });
    const harness = await RouterTestingHarness.create();

    const component = await harness.navigateByUrl(url, CvComponent);

    expect(component).toBeInstanceOf(CvComponent);
    expect(harness.routeNativeElement?.textContent).toContain(expectedName);
  });

  it('redirects unknown routes to the portfolio home page', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(APP_ROUTES)] });
    const harness = await RouterTestingHarness.create();

    const component = await harness.navigateByUrl('/missing', HomePage);

    expect(component).toBeInstanceOf(HomePage);
    expect(TestBed.inject(Router).url).toBe('/');
  });
});
