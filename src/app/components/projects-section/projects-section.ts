import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectCard } from '../project-card/project-card';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-projects-section',
  imports: [ProjectCard, TranslationPipe],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  readonly projects = input.required<readonly Project[]>();
  readonly openDialog = output<Project>();
}
