import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslationPipe } from '../../i18n/translation.pipe';
import { yearsOfExperience } from '../../utils/experience';

@Component({
  selector: 'app-about',
  imports: [TranslationPipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly years = yearsOfExperience();
  protected readonly yearsText = computed(() => String(this.years));
  protected readonly stack: readonly string[] = [
    'Angular',
    'TypeScript',
    'Spring Boot',
    'Python',
    'Kubernetes',
    'Express',
    'Prisma',
    'MySQL',
    'Postgres',
    'Tailwind',
    'Astro',
  ];
}