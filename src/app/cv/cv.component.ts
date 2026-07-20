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
    this.route.parent!.paramMap.pipe(map((p) => this.normalize(p.get('lang')))),
    { initialValue: 'es' as 'es' | 'en' },
  );
  protected readonly data = computed(() => CV[this.lang()]);

  private normalize(raw: string | null): 'es' | 'en' {
    // Acepta 'es' y 'en' literales; cualquier otro cae a 'es'.
    // Esto evita depender del nombre de la clave del param (que con constraint
    // patterns como `:lang(es|en)` se vuelve literal `"lang(es|en)"`).
    const first = (raw ?? '').toLowerCase().split(/[^a-z]/)[0];
    return first === 'en' ? 'en' : 'es';
  }
}