import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslationPipe implements PipeTransform {
  private readonly service: TranslationService;

  constructor(service: TranslationService) {
    this.service = service;
  }

  transform(key: string, params?: Record<string, string | number>): string {
    return this.service.t(key, params);
  }
}
