import type { CvData } from './cv.types';

const HEADER = {
  name: 'Patricio Emanuel Manquepillan Torres',
  contact: [
    {
      label: 'Email',
      value: 'patriciomanquepillantorres@gmail.com',
      href: 'mailto:patriciomanquepillantorres@gmail.com',
    },
    {
      label: 'Teléfono',
      value: '+56 962575863',
      href: 'tel:+56962575863',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/patricio-manquepillan-torres',
      href: 'https://www.linkedin.com/in/patricio-manquepillan-torres',
    },
    {
      label: 'GitHub',
      value: 'github.com/ptorresmanque',
      href: 'https://github.com/ptorresmanque',
    },
    {
      label: 'Web',
      value: 'cualautocompro.cl',
      href: 'https://cualautocompro.cl',
    },
  ],
};

const EXPERIENCE_ES: CvData['experience'] = [
  {
    company: 'Comunidad de Madrid (vía NTT Data España)',
    role: 'Frontend developer',
    period: '2025 — actualidad',
    bullets: [
      'Frontend en un equipo de 12 personas en el portal institucional con 2M visitas/mes, donde cada cambio toca la experiencia de ciudadanía a escala regional.',
      'Construí una librería accesible (combobox, modal con focus trap, navegación por teclado) que se convirtió en estándar interno, lo que redujo el costo de accesibilidad en los siguientes portales del gobierno regional.',
      'Optimicé SSR con Angular Universal hasta TTFB < 200 ms en los 200 trámites más consultados, lo que impacta directamente SEO y tasa de abandono en flujos críticos.',
    ],
    stack: ['Angular', 'micro front ends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (vía NTT Data)',
    role: 'Fullstack developer',
    period: 'abr 2022 — abr 2025',
    bullets: [
      'Sistema automatizado de backstops crediticios con motor de reglas configurable, scoring e integración con sistemas internos, dentro de iniciativa conjunta del banco con la Unión Europea — el motor que decide qué operaciones requieren cobertura adicional.',
      'Evolucioné de frontend Angular a gestionar y desplegar microservicios backend en Java + Spring Boot sobre Kubernetes, lo que entrega escalado automático y despliegues sin downtime en una plataforma regulada.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unifiqué la telemetría y los SCADA de las 4 empresas del grupo (Aguas Altiplano, Chañar, Araucanía, Magallanes), lo que centralizó la operación que antes estaba fragmentada en versiones obsoletas y sin parches.',
      'Migré más de 50 plantas al nuevo SCADA sobre AVEVA System Platform, incluida la desalinizadora por ósmosis inversa de Iquique — datos en vivo que hoy sostienen decisiones operativas 24/7.',
      'Construí la app web de visualización con Angular + Spring Boot y entrené a operarios en su uso, cerrando el ciclo entre dato y operación en planta.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (proyecto personal)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catálogo del mercado automotriz chileno con búsqueda, comparación y sharing de comparativas — un comparador que se vuelve contenido compartible.',
      'Diseño y construyo el ciclo completo: scraping, modelo de datos en Prisma, backend Express, frontend Angular 22 — cada decisión de arquitectura pasa por ser mantenible solo.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];

const EXPERIENCE_EN: CvData['experience'] = [
  {
    company: 'Community of Madrid (via NTT Data España)',
    role: 'Frontend developer',
    period: '2025 — present',
    bullets: [
      'Frontend on a 12-person team for the institutional portal serving 2M visits/month, where each change reaches citizens at a regional scale.',
      'Built an accessible component library (combobox, modal with focus trap, keyboard navigation for long lists) that became the internal standard, lowering the accessibility cost for the regional government\'s next portals.',
      'Optimised SSR with Angular Universal down to TTFB < 200 ms across the 200 most-consulted procedures, directly improving SEO and abandonment in critical flows.',
    ],
    stack: ['Angular', 'micro frontends', 'Capacitor', 'TypeScript', 'PostgreSQL', 'Jenkins'],
  },
  {
    company: 'Banco Santander España (via NTT Data)',
    role: 'Fullstack developer',
    period: 'Apr 2022 — Apr 2025',
    bullets: [
      'Automated credit-backstop management system with a configurable rules engine, transaction scoring, and integration with the bank\'s internal systems, within a joint bank–European Union initiative — the engine that decides which transactions require additional coverage.',
      'Grew from Angular frontend to owning and deploying backend microservices in Java + Spring Boot on Kubernetes, delivering autoscaling and zero-downtime deployments on a regulated platform.',
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Aguas Nuevas S.A.',
    role: 'Frontend / SCADA Developer / DBA',
    period: '2019 — 2022',
    bullets: [
      'Unified telemetry and SCADA systems of the 4 companies in the group (Aguas Altiplano, Chañar, Araucanía, Magallanes), centralising operations that had been fragmented across outdated, unpatched versions.',
      'Migrated 50+ plants to the new SCADA on AVEVA System Platform, including the Iquique reverse-osmosis desalination plant — live data that today underpins 24/7 operational decisions.',
      'Built the visualisation web app with Angular + Spring Boot and trained operators in its use, closing the loop between data and on-site operation.',
    ],
    stack: ['AVEVA System Platform', 'Oracle SQL', 'Angular', 'Spring Boot', 'Python', 'Highcharts'],
  },
  {
    company: 'cualautocompro.cl (personal project)',
    role: 'Owner',
    period: '2026',
    bullets: [
      'Catalog of the Chilean auto market with browsing, searching, and sharing of user-built comparisons — a comparator that doubles as shareable content.',
      'Design and build the full cycle: scraping layer, data model in Prisma, Express backend, Angular 22 frontend — every architectural decision passes the solo-maintainability test.',
    ],
    stack: ['Angular 22', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'Tailwind CSS', 'Playwright'],
  },
];

const SKILLS_ES: CvData['skills'] = [
  {
    category: 'Frontend',
    items: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Accesibilidad WCAG AA'],
  },
  {
    category: 'Backend',
    items: ['Java', 'Spring Boot', 'Node.js', 'Express', 'REST'],
  },
  {
    category: 'Datos e infra',
    items: ['Kubernetes', 'Oracle SQL', 'MySQL', 'Prisma', 'Docker'],
  },
  {
    category: 'Prácticas',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accesibilidad con NVDA / VoiceOver', 'Git', 'SDLC'],
  },
];

const SKILLS_EN: CvData['skills'] = [
  {
    category: 'Frontend',
    items: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'WCAG AA accessibility'],
  },
  {
    category: 'Backend',
    items: ['Java', 'Spring Boot', 'Node.js', 'Express', 'REST'],
  },
  {
    category: 'Data & infra',
    items: ['Kubernetes', 'Oracle SQL', 'MySQL', 'Prisma', 'Docker'],
  },
  {
    category: 'Practices',
    items: ['SSR (Angular Universal)', 'SCADA (AVEVA System Platform)', 'Accessibility testing with NVDA / VoiceOver', 'Git', 'SDLC'],
  },
];

const LANGUAGES: CvData['languages'] = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B2 (MCER)' },
];

export const CV: Record<'es' | 'en', CvData> = {
  es: {
    header: HEADER,
    summary:
      'Senior Frontend Developer con +6 años en producción. Angular lead con foco en accesibilidad WCAG AA y sistemas con cientos de miles de usuarios. Cuando hace falta, participa en el backend con el mismo nivel de rigor.',
    experience: EXPERIENCE_ES,
    education: [
      {
        degree: 'Formación técnica en ingeniería informática',
        note: 'Estudios parciales',
      },
    ],
    skills: SKILLS_ES,
    languages: LANGUAGES,
    referencesNote: 'Referencias disponibles bajo petición',
  },
  en: {
    header: HEADER,
    summary:
      'Senior Frontend Developer with 6+ years in production. Angular lead focused on WCAG AA accessibility and products used by hundreds of thousands of people. When needed, I take part in the backend with the same standard of rigour.',
    experience: EXPERIENCE_EN,
    education: [
      {
        degree: 'Technical education in computer engineering',
        note: 'Incomplete studies',
      },
    ],
    skills: SKILLS_EN,
    languages: LANGUAGES,
    referencesNote: 'References available upon request',
  },
};
