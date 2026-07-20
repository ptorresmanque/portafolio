import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-hero',
  imports: [TranslationPipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly i18n = inject(TranslationService);
  protected readonly cvHrefEs = '/cv-es.pdf';
  protected readonly cvHrefEn = '/cv-en.pdf';
  protected readonly currentCvHref = computed(() =>
    this.i18n.lang() === 'en' ? this.cvHrefEn : this.cvHrefEs,
  );
}