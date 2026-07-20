import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CV } from './data/cv.data';

@Component({
  selector: 'app-cv',
  standalone: true,
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly lang = toSignal(
    this.route.parent!.paramMap.pipe(map((p) => (p.get('lang') as 'es' | 'en') ?? 'es')),
    { initialValue: 'es' as 'es' | 'en' },
  );
  protected readonly data = computed(() => CV[this.lang()]);
}