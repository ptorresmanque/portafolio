import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Project, PersonalProject, WorkProject } from '../../models/project';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, TranslationPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly index = input<number>(0);
  readonly openDialog = output<Project>();

  protected readonly githubUrl = computed(() => {
    const p = this.project();
    return p.kind === 'personal' ? (p as PersonalProject).githubUrl : '';
  });

  protected readonly siteUrl = computed(() => {
    const p = this.project();
    return p.kind === 'personal' ? ((p as PersonalProject).siteUrl ?? null) : null;
  });

  protected readonly kindLabel = computed(() => {
    const p = this.project();
    const key = p.kind === 'work' ? 'projects.kind.work' : 'projects.kind.personal';
    return key;
  });

  protected readonly hasHighlights = computed(() => {
    const p = this.project();
    return (p.highlights?.length ?? 0) > 0;
  });

  protected onCardClick(): void {
    const p = this.project();
    if (p.kind === 'work') this.openDialog.emit(p);
  }
}
