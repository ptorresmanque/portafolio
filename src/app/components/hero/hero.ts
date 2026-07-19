import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';

@Component({
  selector: 'app-hero',
  imports: [TranslationPipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
