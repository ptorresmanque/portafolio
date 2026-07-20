import { Injectable, computed, inject } from '@angular/core';
import { Project } from '../models/project';
import { TranslationService } from '../i18n/translation.service';
import { applyLocalization } from '../utils/localize-project';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly i18n = inject(TranslationService);

  localized(project: Project) {
    return computed(() => {
      const overlay = project.localized?.en;
      return this.i18n.lang() === 'en' ? applyLocalization(project, overlay) : project;
    });
  }
}