import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService, Lang } from './translation.service';
import { TranslationPipe } from './translation.pipe';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  imports: [TranslationPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="group"
      [attr.aria-label]="'langToggle.ariaLabel' | t"
      class="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 text-xs font-medium backdrop-blur"
    >
      @for (l of langs; track l) {
        <button
          type="button"
          (click)="setLang(l)"
          [attr.aria-pressed]="service.lang() === l"
          [attr.aria-label]="ariaLabel(l)"
          class="rounded-full px-2.5 py-1 transition-colors"
          [class.bg-foreground]="service.lang() === l"
          [class.text-background]="service.lang() === l"
          [class.text-secondary]="service.lang() !== l"
          [class.hover:text-foreground]="service.lang() !== l"
        >
          {{ l === 'es' ? 'ES' : 'EN' }}
        </button>
      }
    </div>
  `,
})
export class LangToggle {
  protected readonly service = inject(TranslationService);
  protected readonly langs: readonly Lang[] = ['es', 'en'];

  protected setLang(lang: Lang): void {
    void this.service.setLang(lang);
  }

  protected ariaLabel(lang: Lang): string {
    return lang === 'es'
      ? this.service.t('langToggle.labelEs')
      : this.service.t('langToggle.labelEn');
  }
}
