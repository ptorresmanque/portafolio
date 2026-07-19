import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaPayload, JsonLd } from './seo.types';

const SITE_NAME = 'Patricio Manquepillan — Portafolio';
const DEFAULT_OG = 'https://patriciomanquepillan.com/og-default.png';
const DEFAULT_URL = 'https://patriciomanquepillan.com/';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  setMeta(payload: MetaPayload): void {
    const fullTitle = `${payload.title} — ${SITE_NAME}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: payload.description });
    this.meta.updateTag({ name: 'author', content: 'Patricio Manquepillan' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    const ogImage = payload.ogImage ?? DEFAULT_OG;
    const url = payload.url ?? DEFAULT_URL;

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: payload.description });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CL' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: payload.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });
  }

  setCanonical(url: string = DEFAULT_URL): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setStructuredData(payload: JsonLd, key: string = 'default'): void {
    const selector = `script[type="application/ld+json"][data-seo-key="${key}"]`;
    const existing = this.doc.head.querySelector(selector);
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-key', key);
    script.textContent = JSON.stringify(payload);
    this.doc.head.appendChild(script);
  }
}
