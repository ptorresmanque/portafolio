import { Project, WorkProject } from '../models/project';
import { JsonLd } from './seo.types';

const SITE_URL = 'https://patriciomanquepillan.com';

export function buildPerson(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Patricio Manquepillan',
    jobTitle: 'Senior Frontend Developer',
    url: SITE_URL,
    email: 'mailto:patriciomanquepillantorres@gmail.com',
    sameAs: [
      'https://github.com/ptorresmanque',
      'https://www.linkedin.com/in/patriciomanquepillan',
    ],
    knowsAbout: [
      'Angular',
      'TypeScript',
      'SCADA',
      'WCAG',
      'Kubernetes',
      'Java',
      'Spring Boot',
    ],
  };
}

export function buildWebSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: 'Patricio Manquepillan — Portafolio',
    inLanguage: ['es', 'en'],
    publisher: { '@type': 'Person', name: 'Patricio Manquepillan' },
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
    dateCreated: project.year,
    url: `${SITE_URL}/#${project.id}`,
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

export function buildBreadcrumb(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
    ],
  };
}
