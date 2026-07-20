import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { ProjectsSection } from '../../components/projects-section/projects-section';
import { ProjectDialog } from '../../components/project-dialog/project-dialog';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../models/project';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    Header,
    Footer,
    TranslationPipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly projects = PROJECTS;
  readonly dialogProject = signal<Project | null>(null);

  openDialog(project: Project): void {
    this.dialogProject.set(project);
  }

  closeDialog(): void {
    this.dialogProject.set(null);
  }
}
