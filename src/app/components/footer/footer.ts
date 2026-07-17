import { Component } from '@angular/core';

interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly links: readonly FooterLink[] = [
    { label: 'Email', href: 'mailto:patriciomanquepillantorres@gmail.com', external: false },
    { label: 'LinkedIn', href: '#', external: true },
    { label: 'GitHub', href: 'https://github.com/ptorresmanque', external: true },
  ];
}
