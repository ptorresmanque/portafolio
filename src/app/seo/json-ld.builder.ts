import { Project, WorkProject } from '../models/project';
import { JsonLd } from './seo.types';

const SITE_URL = 'https://patriciomanquepillan.com';
const PROJECTS_SECTION_URL = `${SITE_URL}/#proyectos`;

export function buildPerson(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Patricio Emanuel Manquepillan Torres',
    givenName: 'Patricio Emanuel',
    familyName: 'Manquepillan Torres',
    jobTitle: 'Senior Frontend Developer',
    description:
      'Senior Frontend Developer with 6+ years in production. Angular, TypeScript, WCAG AA accessibility.',
    url: SITE_URL,
    email: 'mailto:patriciomanquepillantorres@gmail.com',
    sameAs: [
      'https://github.com/ptorresmanque',
      'https://www.linkedin.com/in/patriciomanquepillan',
      SITE_URL,
    ],
    knowsAbout: [
      'Angular',
      'TypeScript',
      'RxJS',
      'WCAG AA',
      'Accessibility',
      'SSR',
      'Angular Universal',
      'Kubernetes',
      'Java',
      'Spring Boot',
      'SCADA',
      'AVEVA System Platform',
      'Node.js',
      'Express',
      'Prisma',
      'MySQL',
      'PostgreSQL',
      'Docker',
      'SDLC',
    ],
  };
}

export function buildWebSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Patricio Manquepillan — Portafolio',
    inLanguage: ['es-CL', 'en-US'],
    publisher: {
      '@type': 'Person',
      name: 'Patricio Emanuel Manquepillan Torres',
    },
  };
}

export function buildCreativeWork(project: Project): JsonLd {
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    author: { '@type': 'Person', name: 'Patricio Manquepillan' },
    about: project.shortDescription,
    keywords: project.technologies.join(', '),
    temporalCoverage: project.year,
    url: PROJECTS_SECTION_URL,
  };
  if (project.kind === 'work') {
    const letter = (project as WorkProject).letter;
    if (letter) {
      base['review'] = {
        '@type': 'Review',
        author: { '@type': 'Person', name: letter.signer.name },
        reviewBody: letter.paragraphs.join('\n\n'),
        itemReviewed: { '@type': 'CreativeWork', name: project.title },
      };
    }
  }
  return base;
}

// BreadcrumbList is intentionally not emitted: a single-item breadcrumb
// (the home page) adds no signal beyond what the WebSite schema already
// provides, and Google has explicitly discouraged "home-only" breadcrumbs.
// When Phase 2 introduces real per-section routing, wire this back in.
export function buildBreadcrumb(): JsonLd | null {
  return null;
}
