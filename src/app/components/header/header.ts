import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { LangToggle } from '../../i18n/lang-toggle.component';

@Component({
  selector: 'app-header',
  imports: [TranslationPipe, LangToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly scrolled = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener(
      'scroll',
      () => {
        this.scrolled.set(window.scrollY > 8);
      },
      { passive: true },
    );
  }
}
