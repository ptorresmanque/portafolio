import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly scrolled = signal(false);
  protected readonly email = 'patriciomanquepillantorres@gmail.com';

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', () => {
      this.scrolled.set(window.scrollY > 8);
    }, { passive: true });
  }
}
