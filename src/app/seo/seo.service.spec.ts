import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
  });

  it('setMeta updates title and description', () => {
    service.setMeta({ title: 'Hi', description: 'desc' });
    expect(document.title).toContain('Hi');
    expect(document.title).toContain('Patricio Manquepillan');
    const desc = document.head.querySelector('meta[name="description"]');
    expect(desc?.getAttribute('content')).toBe('desc');
  });

  it('setStructuredData injects a JSON-LD script', () => {
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'X' });
    const script = document.head.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const json = JSON.parse(script!.textContent!);
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('X');
  });

  it('setStructuredData replaces a previous script of the same key', () => {
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'A' }, 'person');
    service.setStructuredData({ '@context': 'https://schema.org', '@type': 'Person', name: 'B' }, 'person');
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"][data-seo-key="person"]');
    expect(scripts.length).toBe(1);
    expect(JSON.parse(scripts[0].textContent!).name).toBe('B');
  });

  it('canonical link is set', () => {
    service.setCanonical('https://example.com/');
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/');
  });
});
