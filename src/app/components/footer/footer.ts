import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { TranslationService } from '../../i18n/translation.service';

interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}

@Component({
  selector: 'app-footer',
  imports: [TranslationPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly i18n = inject(TranslationService);
  protected readonly year = new Date().getFullYear();
  protected readonly cvHrefEs = '/cv-es.pdf';
  protected readonly cvHrefEn = '/cv-en.pdf';
  protected readonly currentCvHref = computed(() =>
    this.i18n.lang() === 'en' ? this.cvHrefEn : this.cvHrefEs,
  );
  protected readonly currentCvLabel = computed(() =>
    this.i18n.lang() === 'en' ? 'footer.cvLinkEn' : 'footer.cvLink',
  );
  protected readonly links: readonly FooterLink[] = [
    { label: 'Email', href: 'mailto:patriciomanquepillantorres@gmail.com', external: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/patricio-manquepillan-torres', external: true },
    { label: 'GitHub', href: 'https://github.com/ptorresmanque', external: true },
  ];
}
