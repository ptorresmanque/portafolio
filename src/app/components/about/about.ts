import { Component } from '@angular/core';
import { yearsOfExperience } from '../../utils/experience';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly yearsOfExperience = yearsOfExperience();
  protected readonly stack: readonly string[] = [
    'Angular',
    'TypeScript',
    'RxJS',
    'NgRx',
    'Tailwind',
    'Next.js',
    'Node.js',
    'Postgres',
    'Supabase',
    'Vitest',
  ];
}
