import { Project } from '../models/project';

const u = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PROJECTS: Project[] = [
  {
    id: 'telemetria-2-0',
    title: 'Telemetria 2.0',
    company: '— pendiente',
    year: '2024',
    role: 'Frontend lead',
    image: u('1551288049-bebda4e38f71'),
    imageAlt: 'Dashboard con gráficos de telemetría en tiempo real',
    shortDescription:
      'Plataforma de telemetría IoT que centraliza métricas de dispositivos en terreno y dispara alertas configurables en tiempo real.',
    technologies: ['Angular', 'RxJS', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSockets'],
    body: `Telemetria 2.0 nació como la segunda iteración de un sistema interno que monitorea más de 4.000 dispositivos distribuidos en terreno. Mi rol fue liderar el desarrollo frontend desde cero: diseñé la arquitectura de módulos, el sistema de streams reactivos con RxJS para ingestar eventos en vivo y la librería de visualización con D3.js que se reutiliza entre los distintos paneles.

El desafío técnico más interesante fue mantener 60 fps en el panel principal con gráficos actualizándose cada segundo. Resolví esto combinando un buffer de muestras con requestAnimationFrame y deduplicación por device-id, lo que bajó el CPU del cliente de ~80% a ~15%. Adicionalmente construí un DSL declarativo para que operadores no técnicos puedan definir alertas complejas sin tocar código.

El producto estuvo en producción durante 14 meses con un uptime medido del 99.94% y fue el primer sistema interno en ser migrado completamente a la nueva plataforma de la empresa.`,
    letterImage: u('1455390582262-044cdead277a', 1200),
    letterAlt: 'Carta de recomendación firmada por el responsable del proyecto Telemetria 2.0',
  },
  {
    id: 'backstops',
    title: 'Backstops',
    company: '— pendiente',
    year: '2023',
    role: 'Fullstack engineer',
    image: u('1611974789855-9c2a0a7236a3'),
    imageAlt: 'Interfaz de plataforma financiera con tablas y métricas',
    shortDescription:
      'Producto fintech B2B para gestionar backstops crediticios: reglas configurables, scoring y reporting regulatorio automatizado.',
    technologies: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Stripe'],
    body: `Backstops centraliza la operatoria de backstops crediticios de una fintech en pleno proceso de salida a mercado regulatorio. Llegué como fullstack pero terminé prácticamente dueño técnico del producto junto al CTO.

Construí desde el motor de reglas (un AST tipado en TypeScript que se serializa a Postgres para auditoría) hasta las APIs REST con NestJS, además de las pantallas de configuración de políticas y los flujos de revisión manual que usan los analistas.

La pieza que más disfruté fue el módulo de reporting regulatorio: automatizaba reportes que antes se hacían a mano en Excel y que tomaban 3 días por cierre mensual. Lo dejé en 2 horas por click, con lineage de datos trazable y firma digital de cada versión generada. Fue el primer entregable que aprobaron los auditores sin observaciones.`,
    letterImage: u('1455390582262-044cdead277a', 1200),
    letterAlt: 'Carta de recomendación firmada por el responsable del proyecto Backstops',
  },
  {
    id: 'comunidad-madrid',
    title: 'Comunidad de Madrid',
    company: '— pendiente',
    year: '2023',
    role: 'Frontend engineer',
    image: u('1568992687947-868a78220f0f'),
    imageAlt: 'Edificio institucional de gobierno',
    shortDescription:
      'Portal institucional de la Comunidad de Madrid: buscador de trámites, agenda de eventos y tablón de anuncios accesible para ciudadanos.',
    technologies: ['Angular', 'SSR', 'WCAG AA', 'Algolia', 'Strapi'],
    body: `Proyecto licitado para digitalizar la experiencia ciudadana de la Comunidad de Madrid. Trabajé como frontend engineer dentro de un equipo de 12 personas, enfocado en los flujos de búsqueda y descubrimiento de trámites públicos.

La restricción de accesibilidad WCAG AA fue la que más marqué el producto: cada componente pasó por revisión con NVDA y VoiceOver antes de mergear. Construí una librería de componentes accesibles (combobox custom, modal con focus trap, navegación con teclado en listados largos) que luego se convirtió en el estándar interno para los siguientes portales del gobierno regional.

Otro pilar fue el SSR con Angular Universal: el portal recibe ~2M de visitas/mes y un TTFB sub-200ms era no negociable. Optimicé el caching de cabeceras, lazy-loading por ruta y pre-rendering de los 200 trámites más consultados.`,
    letterImage: u('1455390582262-044cdead277a', 1200),
    letterAlt: 'Carta de recomendación firmada por el responsable del proyecto Comunidad de Madrid',
  },
  {
    id: 'cualautocompro-cl',
    title: 'cualautocompro.cl',
    company: '— pendiente',
    year: '2024',
    role: 'Tech lead',
    image: u('1556742049-0cfed4f6a45d'),
    imageAlt: 'Tienda online con productos y carrito',
    shortDescription:
      'Comparador de marketplaces chileno: ayuda a decidir dónde comprar un producto cruzando precio, stock y reputación de vendedor.',
    technologies: ['Angular', 'Next.js', 'Supabase', 'Stripe', 'Playwright'],
    body: `cualautocompro.cl es un comparador de marketplaces chileno que surgió como side-project y terminó siendo adquirido. Yo fui tech lead desde la concepción.

Diseñé la arquitectura headless: Angular para el storefront y Next.js para el blog SEO y la landing principal. Los datos de productos vienen de una capa de scraping propio que corre en workers agendados y se consolidan en Supabase con índices GIN para búsqueda full-text en español.

La pieza más interesante fue el ranker: cruza precio, tiempo de envío, reputación del vendedor y disponibilidad real. Implementé un sistema de pesos configurable por categoría (una búsqueda de notebooks pondera distinto que una de cepillos de dientes) y un sistema de explicabilidad para que el usuario entienda por qué un resultado ganó.

Después del lanzamiento, el sitio promedió 18k visitas orgánicas mensuales con 6 conversiones diarias hacia los marketplaces afiliados.`,
    letterImage: u('1455390582262-044cdead277a', 1200),
    letterAlt: 'Carta de recomendación firmada por el responsable del proyecto cualautocompro.cl',
  },
];
