# Portafolio

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Generating CV PDFs

The "Download CV" buttons in the hero and footer link to `/cv-es.pdf` and `/cv-en.pdf`. These PDFs are not committed to the repo — they are generated into `public/` (which `ng serve` serves directly and `ng build` copies into `dist/`).

To regenerate just the PDFs (after editing CV data in `src/app/cv/data/cv.data.ts`):

```bash
npm run build
npm run cv
```

Or run the full build + CV generation in one command:

```bash
npm run build:full
```

For local dev with the buttons working, run the script once after `npm install`:

```bash
npm run build && npm run cv   # genera public/cv-{es,en}.pdf
npm start                      # ng serve los sirve en /cv-{es,en}.pdf
```

The script uses Puppeteer with the bundled Chromium. On first install it downloads ~300 MB. Set `PUPPETEER_SKIP_DOWNLOAD=true` if you have a system Chrome and want to use it instead.

The CV is rendered from an Angular component (`src/app/cv/`) and printed to single-page A4 PDFs at `public/cv-es.pdf` and `public/cv-en.pdf` (Angular copies them into `dist/portafolio/browser/` on build).

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
