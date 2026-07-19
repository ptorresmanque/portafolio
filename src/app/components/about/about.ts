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
