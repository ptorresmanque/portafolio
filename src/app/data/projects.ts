import { Project } from '../models/project';

const u = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PROJECTS: Project[] = [
  {
    id: 'telemetria-2-0',
    kind: 'work',
    title: 'Telemetría 2.0',
    company: 'Aguas Nuevas S.A.',
    year: '2019 — 2022',
    role: 'Frontend Developer · SCADA Developer (AVEVA) · DBA',
    image: '/projects/telemetria.svg',
    imageAlt: 'HMI estilo AVEVA System Platform mostrando PTAP Iquique: bombas, filtro, estanques con niveles en vivo y panel de alarmas',
    shortDescription:
      'Unifiqué la telemetría y los SCADA de las 4 empresas del grupo Aguas Nuevas en una sola plataforma web, con datos en vivo de 50+ plantas.',
    technologies: [
      'AVEVA System Platform',
      'Oracle SQL',
      'Angular',
      'Spring Boot',
      'Python',
      'Highcharts',
      'Git',
    ],
    body: `Telemetría 2.0 surgió como respuesta a una problemática estructural del grupo Aguas Nuevas: cada una de las cuatro empresas que lo componían —Aguas Altiplano, Aguas Chañar, Aguas Araucanía y Aguas Magallanes— operaba su propio sistema SCADA de manera independiente, con versiones obsoletas, licencias en modo trial y sin parches de seguridad. La administración de estos sistemas recaía en el área de mantenimiento —frecuentemente con personal subcontratado— sin protocolos formales de soporte, lo que impedía centralizar la información operativa y explotar la data generada por las plantas de tratamiento y distribución de agua.

El proyecto abordó esta fragmentación con un alcance definido: acordar un nuevo diseño de SCADA, construir un sistema unificado para las cuatro empresas, migrar las bases de datos de las plantas —incluyendo la emblemática desalinizadora por ósmosis inversa de Iquique—, incorporar progresivamente la totalidad de las plantas a la nueva plataforma, desarrollar una aplicación web para la visualización de los datos unificados y capacitar a los operarios en su uso.

Mi rol fue integral: participé en la toma de requerimientos, el análisis y diseño de soluciones, la implementación del sistema SCADA sobre AVEVA System Platform (versiones 2017 a 2021), la migración de las bases de datos en Oracle SQL, el desarrollo frontend de la aplicación de visualización con Angular y Spring Boot, y la capacitación a los operarios de las plantas. El trabajo se enmarcó en el ciclo de vida de desarrollo de software (SDLC) como metodología de gestión.

Entre los principales logros del proyecto destaco la unificación de las bases de datos de las cuatro empresas del grupo, la migración exitosa de más de cincuenta plantas al nuevo sistema SCADA —incluida la desalinizadora de Iquique— y la implementación de la aplicación web para la visualización de datos operativos.`,
    letter: {
      paragraphs: [
        'Por medio de la presente, yo Michael Antonio Bórquez Sandoval, Jefe de Proyectos en Aguas Nuevas S.A., me permito emitir esta carta de referencia profesional a favor del Sr. Patricio Emanuel Manquepillan Torres, quien se desempeñó en nuestra organización durante el período 2019–2022 en los roles de Frontend Developer, SCADA Developer sobre AVEVA System Platform y Administrador de Bases de Datos.',
        'El Sr. Manquepillan fue parte del equipo del "Proyecto 2.0", una iniciativa estratégica orientada a unificar la telemetría y los sistemas de supervisión de las cuatro empresas que en ese momento componían el grupo Aguas Nuevas: Aguas Altiplano, Aguas Chañar, Aguas Araucanía y Aguas Magallanes. Hasta entonces, cada empresa operaba de forma independiente su propio sistema SCADA, con versiones obsoletas, licencias en modo trial y sin parches de seguridad. La administración de estos sistemas recaía en el área de mantenimiento —frecuentemente con personal subcontratado— sin protocolos formales de soporte, lo que impedía almacenar la información operativa de manera centralizada y, por tanto, explotar la data generada por las plantas de tratamiento y distribución de agua. El proyecto abordó estas brechas con un alcance definido: acordar un nuevo diseño de SCADA, construir un sistema unificado para las cuatro empresas, migrar las bases de datos de las plantas —incluyendo la emblemática desalinizadora por ósmosis inversa de Iquique—, incorporar progresivamente la totalidad de las plantas a la nueva plataforma, desarrollar una aplicación web para la visualización de los datos unificados y capacitar a los operarios en su uso.',
        'En el ámbito técnico, el Sr. Manquepillan demostró un dominio consistente de un stack diverso y exigente: AVEVA System Platform en sus versiones 2017 a 2021 para la implementación del SCADA corporativo, Oracle SQL para la administración y migración de las bases de datos, Angular y Spring Boot como base de la aplicación web de visualización, Python para tareas de soporte y análisis, Git como sistema de control de versiones y Highcharts para la representación de indicadores operativos. Su participación fue integral, abarcando la toma de requerimientos, el análisis y diseño de soluciones, la implementación del sistema SCADA, la migración de las bases de datos, el desarrollo frontend y la capacitación a los operarios de las plantas.',
        'Su trabajo se enmarcó en el ciclo de vida de desarrollo de software (SDLC) como metodología de gestión, lo que se tradujo en entregas consistentes, documentadas y alineadas con los hitos del proyecto. Entre los logros atribuibles a su contribución destaco la unificación de las bases de datos de las cuatro empresas del grupo, la migración exitosa de más de cincuenta plantas al nuevo sistema SCADA —incluida la desalinizadora de Iquique— y la implementación de la aplicación web para la visualización de datos.',
        'Por lo expuesto, recomiendo al Sr. Manquepillan sin reservas como un profesional técnicamente sólido, autónomo y comprometido, capaz de asumir proyectos de alta complejidad técnica en entornos críticos. Considero que su perfil constituye un aporte valioso para cualquier organización o programa que demande competencias comprobadas en sistemas SCADA, gestión de bases de datos y desarrollo de aplicaciones web en el sector industrial.',
      ],
      signer: {
        name: 'Michael Antonio Bórquez Sandoval',
        role: 'Jefe de Proyectos',
        company: 'Aguas Nuevas S.A.',
      },
    },
    localized: {
      en: {
        imageAlt: 'AVEVA System Platform-style HMI showing PTAP Iquique: pumps, filters, tanks with live levels, and an alarm panel',
        shortDescription:
          'Unified the telemetry and SCADA systems of all 4 companies in the Aguas Nuevas group into a single web platform, with live data from 50+ plants.',
        body: `Telemetría 2.0 was born out of a structural problem in the Aguas Nuevas group: each of the four companies that made it up —Aguas Altiplano, Aguas Chañar, Aguas Araucanía, and Aguas Magallanes— ran its own SCADA independently, on outdated versions, trial licenses, and without security patches. Administering these systems fell on the maintenance area —often with subcontracted staff— with no formal support protocols, which made it impossible to centralize operational data or exploit the information generated by the water treatment and distribution plants.

The project tackled that fragmentation with a defined scope: agree on a new SCADA design, build a unified system for the four companies, migrate the plant databases —including the iconic reverse-osmosis desalination plant in Iquique—, progressively bring every plant onto the new platform, ship a web app for visualizing the unified data, and train the operators in its use.

My role was end-to-end: requirements gathering, solution analysis and design, SCADA implementation on AVEVA System Platform (versions 2017–2021), Oracle SQL database migrations, frontend development of the visualization app with Angular and Spring Boot, and operator training. We managed the work with the software development life cycle (SDLC) as the governing methodology.

Among the project's main wins: unifying the four companies' databases, successfully migrating more than fifty plants to the new SCADA —including the Iquique desalination plant— and shipping the web app for visualizing operational data.`,
        letter: {
          paragraphs: [
            'Through this letter, I, Michael Antonio Bórquez Sandoval, Projects Lead at Aguas Nuevas S.A., issue this professional reference letter in favor of Mr. Patricio Emanuel Manquepillan Torres, who worked at our organization during the period 2019–2022 in the roles of Frontend Developer, SCADA Developer on AVEVA System Platform, and Database Administrator.',
            'Mr. Manquepillan was part of the "Project 2.0" team, a strategic initiative aimed at unifying the telemetry and supervision systems of the four companies that at the time composed the Aguas Nuevas group: Aguas Altiplano, Aguas Chañar, Aguas Araucanía, and Aguas Magallanes. Until then, each company operated its own SCADA independently, with outdated versions, trial licenses, and no security patches. The administration of these systems fell on the maintenance area —often with subcontracted staff— with no formal support protocols, which made it impossible to store operational information centrally and therefore to exploit the data generated by the water treatment and distribution plants. The project addressed these gaps with a defined scope: agree on a new SCADA design, build a unified system for the four companies, migrate the plant databases —including the iconic reverse-osmosis desalination plant in Iquique—, progressively bring every plant onto the new platform, ship a web app for visualizing the unified data, and train the operators in its use.',
            'On the technical side, Mr. Manquepillan showed consistent command of a demanding and diverse stack: AVEVA System Platform in versions 2017 to 2021 for the corporate SCADA implementation, Oracle SQL for database administration and migration, Angular and Spring Boot as the foundation of the visualization web app, Python for support and analysis tasks, Git as the version control system, and Highcharts for operational indicators. His participation was end-to-end, spanning requirements gathering, solution analysis and design, SCADA implementation, database migration, frontend development, and operator training at the plants.',
            'His work was managed under the software development life cycle (SDLC) as governing methodology, which translated into consistent, well-documented deliveries aligned with the project milestones. Among the wins attributable to his contribution: the unification of the four companies\' databases, the successful migration of more than fifty plants to the new SCADA —including the Iquique desalination plant— and the implementation of the web app for data visualization.',
            'For all of the above, I recommend Mr. Manquepillan without reservation as a technically solid, autonomous, and committed professional, capable of taking on projects of high technical complexity in critical environments. I consider his profile a valuable asset for any organization or program that demands proven competence in SCADA systems, database management, and web application development in the industrial sector.',
          ],
        },
      },
    },
  },
  {
    id: 'backstops',
    kind: 'work',
    title: 'Backstops',
    company: 'Banco Santander España',
    year: '2022 — 2025',
    role: 'Fullstack developer',
    image: u('1611974789855-9c2a0a7236a3'),
    imageAlt: 'Interfaz de plataforma financiera con tablas y métricas',
    shortDescription:
      'Sistema de gestión automatizada de backstops crediticios para el área de Capital, desarrollado en el marco de una iniciativa conjunta con la Unión Europea.',
    technologies: ['Angular', 'Java', 'Spring Boot', 'Kubernetes', 'Git'],
    body: `Backstops es un sistema de gestión automatizada de backstops crediticios que desarrollé en NTT Data España, asignado al área de Capital de Banco Santander, dentro de una iniciativa del banco con la Unión Europea. Estuve en el proyecto entre abril de 2022 y abril de 2025, bajo el liderazgo técnico de Tiago Joel Da Silva Monteiro.

El producto centraliza las políticas de cobertura crediticia: motor de reglas configurable, scoring de operaciones, integración con los sistemas internos del banco y un módulo de reporting regulatorio que automatiza reportes que antes se hacían a mano.

Mi rol pasó de frontend a fullstack. Empecé con las interfaces de configuración y monitoreo en Angular y, con el tiempo, asumí backend en Java y Spring Boot hasta gestionar y desplegar servicios por mi cuenta. La plataforma corría sobre Kubernetes, lo que permitía escalar los workers de ingestión, los microservicios de cálculo y las APIs internas según la carga, sin downtime.`,
    letter: {
      paragraphs: [
        'Por medio de la presente, yo Tiago Joel Da Silva Monteiro, Senior Technical Lead en NTT Data España, me permito emitir esta carta de referencia profesional a favor del Sr. Patricio Emanuel Manquepillan Torres, con quien colaboré como parte del equipo de NTT Data España asignado al área de Capital de Banco Santander España, entre abril de 2022 y abril de 2025.',
        'En el marco de una iniciativa conjunta del banco con la Unión Europea, el Sr. Manquepillan participó en el desarrollo de Backstops —un sistema de gestión automatizada de backstops crediticios que incluye motor de reglas configurable, scoring de operaciones e integración con los sistemas internos del banco, además de un módulo de reporting regulatorio automatizado— junto con otros proyectos del área de Capital en los que también colaboró activamente.',
        'En el ámbito técnico, el Sr. Manquepillan demostró una evolución profesional notable. Aunque su perfil inicial estaba más enfocado en tecnologías frontend —particularmente con Angular—, a lo largo de los proyectos fue adquiriendo sólidos conocimientos y experiencia en el ámbito backend, llegando a dominar Java y Spring Boot y a asumir responsabilidades directas sobre la arquitectura y el ciclo de vida de los servicios. La plataforma se desplegó sobre un clúster de Kubernetes, lo que permitió orquestar los servicios backend del área —workers de ingestión de datos, microservicios de cálculo y APIs internas— con escalado automático según la carga operativa y despliegues sin downtime. En el frontend, su trabajo con Angular se mantuvo como pieza clave de las interfaces de configuración y monitoreo del área de Capital.',
        'La evolución técnica del Sr. Manquepillan, junto con la calidad de su trabajo, le permitió asumir progresivamente mayores responsabilidades hasta llegar a gestionar y desarrollar proyectos de forma autónoma. Esta capacidad de adaptación y crecimiento fue especialmente valiosa en un entorno exigente como el del área de Capital de una gran entidad bancaria, donde las prioridades cambian con frecuencia y los plazos regulatorios son estrictos. El Sr. Manquepillan mostró siempre un elevado sentido de la responsabilidad, una actitud colaborativa y una excelente disposición para trabajar con otros equipos del banco y con los interlocutores del programa conjunto con la Unión Europea cuando la situación lo requería.',
        'Por todo lo expuesto, considero que el Sr. Manquepillan cuenta con una experiencia profesional sólida, una actitud ejemplar y las capacidades necesarias para afrontar con éxito nuevos retos académicos y profesionales. Lo recomiendo sin reservas.',
      ],
      signer: {
        name: 'Tiago Joel Da Silva Monteiro',
        role: 'Senior Technical Lead',
        company: 'NTT Data España',
      },
    },
    localized: {
      en: {
        imageAlt: 'Financial platform interface with tables and metrics',
        shortDescription:
          'Automated credit-backstop management system for the Capital area, built under a joint initiative with the European Union.',
        body: `Backstops is an automated credit-backstop management system I built at NTT Data España, assigned to the Capital area of Banco Santander, within a joint bank–European Union initiative. I was on the project from April 2022 to April 2025, under the technical leadership of Tiago Joel Da Silva Monteiro.

The product centralizes credit-coverage policies: a configurable rules engine, transaction scoring, integration with the bank's internal systems, and a regulatory reporting module that automates reports that were previously produced by hand.

My role grew from frontend to fullstack. I started with the configuration and monitoring interfaces in Angular and, over time, took on backend work in Java and Spring Boot until I was managing and deploying services on my own. The platform ran on Kubernetes, which let us scale ingestion workers, calculation microservices, and internal APIs with the load — no downtime.`,
        letter: {
          paragraphs: [
            'Through this letter, I, Tiago Joel Da Silva Monteiro, Senior Technical Lead at NTT Data España, issue this professional reference letter in favor of Mr. Patricio Emanuel Manquepillan Torres, with whom I collaborated as part of the NTT Data España team assigned to the Capital area of Banco Santander España, between April 2022 and April 2025.',
            'Within the framework of a joint bank–European Union initiative, Mr. Manquepillan participated in the development of Backstops —an automated credit-backstop management system that includes a configurable rules engine, transaction scoring, integration with the bank\'s internal systems, and an automated regulatory reporting module— alongside other Capital-area projects in which he also actively collaborated.',
            'On the technical side, Mr. Manquepillan demonstrated a remarkable professional evolution. Although his initial profile leaned toward frontend technologies —particularly Angular—, over the course of the projects he built solid knowledge and experience on the backend side, eventually mastering Java and Spring Boot and taking on direct responsibility for the architecture and life cycle of services. The platform was deployed on a Kubernetes cluster, which allowed the area\'s backend services —data ingestion workers, calculation microservices, and internal APIs— to be orchestrated with auto-scaling based on operational load and zero-downtime deployments. On the frontend, his Angular work remained a key piece of the Capital area\'s configuration and monitoring interfaces.',
            'Mr. Manquepillan\'s technical evolution, combined with the quality of his work, allowed him to take on progressively greater responsibilities until he was managing and developing projects autonomously. This capacity for adaptation and growth was especially valuable in a demanding environment such as the Capital area of a large bank, where priorities change frequently and regulatory deadlines are strict. Mr. Manquepillan always showed a strong sense of responsibility, a collaborative attitude, and an excellent willingness to work with other teams in the bank and with the interlocutors of the joint European Union program when the situation required it.',
            'For all of the above, I consider Mr. Manquepillan to have a solid professional background, an exemplary attitude, and the capabilities needed to successfully take on new academic and professional challenges. I recommend him without reservation.',
          ],
        },
      },
    },
  },
  {
    id: 'comunidad-madrid',
    kind: 'work',
    title: 'Comunidad de Madrid',
    company: 'Comunidad de Madrid',
    year: '2025 — 2026',
    role: 'Frontend developer',
    image: '/projects/comunidad-madrid.png',
    imageAlt: 'Imagen del proyecto Comunidad de Madrid',
    shortDescription:
      'Portal institucional de la Comunidad de Madrid: buscador de trámites, agenda de eventos y tablón de anuncios accesible para ciudadanos.',
    technologies: ['Angular', 'micro front end', 'capacitor', 'postgresql', 'jenkins', 'mova3 libraries', 'typescript', 'python'],
    body: `Proyecto licitado para digitalizar la experiencia ciudadana de la Comunidad de Madrid. Fui frontend developer en un equipo de 12 personas, centrado en los flujos de búsqueda y descubrimiento de trámites públicos.

La accesibilidad WCAG AA fue lo que más marcó el producto. Cada componente pasaba por revisión con NVDA y VoiceOver antes de mergear. Construí una librería accesible (combobox custom, modal con focus trap, navegación por teclado en listados largos) que después se convirtió en el estándar interno para los siguientes portales del gobierno regional.

El otro pilar fue el SSR con Angular Universal: el portal recibe cerca de 2M de visitas al mes y necesitábamos TTFB bajo 200 ms. Optimicé el caching de cabeceras, el lazy-loading por ruta y el pre-rendering de los 200 trámites más consultados.`,
    localized: {
      en: {
        imageAlt: 'Comunidad de Madrid project screenshot',
        shortDescription:
          'Institutional portal for the Comunidad de Madrid: procedure search, event agenda, and an accessible notice board for citizens.',
        body: `A publicly tendered project to digitize the citizen experience of the Comunidad de Madrid. I was a frontend developer in a 12-person team focused on the search and discovery flows for public procedures.

WCAG AA accessibility defined the product. Every component was reviewed with NVDA and VoiceOver before merge. I built an accessible library (custom combobox, modal with focus trap, keyboard navigation for long lists) that later became the internal standard for the regional government's next portals.

The other pillar was SSR with Angular Universal: the portal sees close to 2M visits a month and we needed TTFB under 200 ms. I tuned header caching, per-route lazy loading, and pre-rendering for the 200 most-consulted procedures.`,
      },
    },
  },
  {
    id: 'cualautocompro-cl',
    kind: 'personal',
    title: 'cualautocompro.cl',
    company: 'Proyecto personal',
    year: '2026',
    role: 'Owner',
    githubUrl: 'https://github.com/ptorresmanque/CualAutoCompro',
    siteUrl: 'https://cualautocompro.cl',
    image: '/projects/cualautocompro.png',
    imageAlt: 'Captura del homepage de cualautocompro.cl: hero, comparativa Toyota Corolla vs Mazda CX-5 y sección de features',
    shortDescription:
      'Catálogo del mercado automotriz chileno. Puedes revisar, buscar y comparar modelos de todas las marcas que se venden en Chile, y compartir las comparativas que armes con otros usuarios.',
    technologies: ['Angular', 'Angular Material', 'Express', 'Prisma', 'MySQL', 'TypeScript', 'Tailwind CSS', 'Playwright'],
    body: `cualautocompro.cl es mi proyecto personal. Una herramienta para analizar el mercado automotriz chileno y ayudar a quien va a comprar un vehículo a elegir mejor. Permite revisar, buscar y comparar modelos y versiones de todas las marcas que se venden en Chile, y compartir comparativas con otros usuarios.

Como único responsable técnico, participé en todo el ciclo: modelé el dominio en Prisma sobre MySQL, construí el backend en Express + TypeScript con autenticación vía Passport (Google y Apple), y el frontend en Angular 22 con Angular Material. Diseñé una capa de scraping propio que mantiene el catálogo al día y un motor de ranker configurable para ponderar versiones según distintos criterios.

Lo que más disfruté fue el modelo de comparativas. Cada usuario arma su comparación, la comparte con un slug, y otros pueden consultarla o extenderla. Un buen análisis se convierte, de paso, en tráfico orgánico para el producto.`,
    localized: {
      en: {
        imageAlt: 'Screenshot of cualautocompro.cl homepage: hero, Toyota Corolla vs Mazda CX-5 comparison, and features section',
        shortDescription:
          'Catalog of the Chilean auto market. Browse, search, and compare models from every brand sold in Chile, and share the comparisons you build with other users.',
        body: `cualautocompro.cl is my personal project. A tool for analyzing the Chilean auto market and helping anyone who's about to buy a vehicle make a better choice. It lets you browse, search, and compare models and trims from every brand sold in Chile, and share the comparisons you build with other users.

As the sole technical owner I worked the full cycle: modeled the domain in Prisma over MySQL, built the backend in Express + TypeScript with Passport authentication (Google and Apple), and the frontend in Angular 22 with Angular Material. I designed a custom scraping layer that keeps the catalog up to date and a configurable ranker engine for weighting trims against different criteria.

The bit I enjoyed most was the comparison model. Each user builds a comparison, shares it via a slug, and others can view or extend it. A solid analysis becomes, on the way, organic traffic for the product.`,
      },
    },
  },
];