import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { TranslationService } from './i18n/translation.service';
import { SeoService } from './seo/seo.service';
import {
  buildBreadcrumb,
  buildCreativeWork,
  buildPerson,
  buildWebSite,
} from './seo/json-ld.builder';
import { PROJECTS } from './data/projects';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      void this.i18n.setLang(this.i18n.lang()).then(() => {
        this.seo.setMeta({
          title: this.i18n.t('meta.title'),
          description: this.i18n.t('meta.description'),
        });
        this.seo.setCanonical('https://patriciomanquepillan.com/');
        this.seo.setStructuredData(buildPerson(), 'person');
        this.seo.setStructuredData(buildWebSite(), 'website');
        const breadcrumb = buildBreadcrumb();
        if (breadcrumb) {
          this.seo.setStructuredData(breadcrumb, 'breadcrumb');
        }
        for (const project of PROJECTS) {
          this.seo.setStructuredData(buildCreativeWork(project), `project-${project.id}`);
        }
      });
    });
  }
}
