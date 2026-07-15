import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-dialog',
  imports: [NgOptimizedImage],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.css',
})
export class ProjectDialog {
  readonly project = input<Project | null>(null);
  readonly closeDialog = output<void>();

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const current = this.project();
      const dialogEl = this.dialogRef().nativeElement;

      if (current) {
        if (!dialogEl.open) {
          dialogEl.showModal();
        }
      } else if (dialogEl.open) {
        dialogEl.close();
      }
    });
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

  private handleClose(): void {
    this.closeDialog.emit();
  }
}
