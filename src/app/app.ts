import { Component, signal } from '@angular/core';
import { About } from './components/about/about';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { ProjectDialog } from './components/project-dialog/project-dialog';
import { ProjectsSection } from './components/projects-section/projects-section';
import { PROJECTS } from './data/projects';
import { Project } from './models/project';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    About,
    ProjectsSection,
    ProjectDialog,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly projects = PROJECTS;
  readonly dialogProject = signal<Project | null>(null);

  openDialog(project: Project): void {
    this.dialogProject.set(project);
  }

  closeDialog(): void {
    this.dialogProject.set(null);
  }
}
