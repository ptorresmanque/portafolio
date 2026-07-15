import { Component, input, output } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-projects-section',
  imports: [ProjectCard],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
})
export class ProjectsSection {
  readonly projects = input.required<readonly Project[]>();
  readonly openDialog = output<Project>();
}
