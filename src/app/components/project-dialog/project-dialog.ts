import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Letter, Project, WorkProject } from '../../models/project';
import { TranslationService } from '../../i18n/translation.service';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-project-dialog',
  imports: [TranslationPipe],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialog {
  private readonly i18n = inject(TranslationService);

  readonly project = input<Project | null>(null);
  readonly closeDialog = output<void>();

  readonly letter = computed<Letter | null>(() => {
    const project = this.project();
    if (project?.kind !== 'work') return null;
    return (project as WorkProject).letter ?? null;
  });

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const current = this.project();
      const dialogEl = this.dialogRef().nativeElement;

      if (current) {
        if (!dialogEl.open) {
          this.previouslyFocused = document.activeElement as HTMLElement | null;
          dialogEl.showModal();
        }
      } else if (dialogEl.open) {
        dialogEl.close();
        queueMicrotask(() => this.previouslyFocused?.focus());
      }
    });
  }

  protected closeAriaLabel(title: string): string {
    return this.i18n.t('dialog.closeAria', { title });
  }

  protected onDialogClick(event: MouseEvent): void {
    const dialogEl = this.dialogRef().nativeElement;
    if (event.target === dialogEl) {
      this.handleClose();
    }
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.handleClose();
  }

  protected handleClose(): void {
    this.closeDialog.emit();
  }
}
