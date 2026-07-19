import { Component, effect, inject, signal } from '@angular/core';
import { About } from './components/about/about';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { ProjectDialog } from './components/project-dialog/project-dialog';
import { ProjectsSection } from './components/projects-section/projects-section';
import { PROJECTS } from './data/projects';
import { Project } from './models/project';
import { TranslationService } from './i18n/translation.service';
import { LangToggle } from './i18n/lang-toggle.component';
import { TranslationPipe } from './i18n/translation.pipe';
import { SeoService } from './seo/seo.service';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    Footer,
    LangToggle,
    TranslationPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);

  readonly projects = PROJECTS;
  readonly dialogProject = signal<Project | null>(null);

  constructor() {
    effect(() => {
      // re-run when language changes; translations JSON must be loaded first
      void this.i18n.setLang(this.i18n.lang()).then(() => {
        this.seo.setMeta({
          title: this.i18n.t('meta.title'),
          description: this.i18n.t('meta.description'),
        });
        this.seo.setCanonical('https://patriciomanquepillan.com/');
      });
    });
  }

  openDialog(project: Project): void {
    this.dialogProject.set(project);
  }

  closeDialog(): void {
    this.dialogProject.set(null);
  }
}
