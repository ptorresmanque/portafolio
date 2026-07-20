import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';
import { ProjectDialog } from './project-dialog';
import { PROJECTS } from '../../data/projects';
import { TranslationService } from '../../i18n/translation.service';

describe('ProjectDialog', () => {
  let componentRef: ComponentRef<ProjectDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProjectDialog] });
    const fixture = TestBed.createComponent(ProjectDialog);
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('creates without crashing', () => {
    expect(componentRef.instance).toBeTruthy();
  });

  it('exposes letter only for work projects', () => {
    componentRef.setInput('project', PROJECTS[0]);
    expect(componentRef.instance.letter()).not.toBeNull();
  });

  it('returns null letter for personal projects', () => {
    const personal = PROJECTS.find((p) => p.kind === 'personal')!;
    componentRef.setInput('project', personal);
    expect(componentRef.instance.letter()).toBeNull();
  });

  it('closeDialog output fires on handleClose', () => {
    let fired = false;
    componentRef.instance.closeDialog.subscribe(() => (fired = true));
    componentRef.instance.handleClose();
    expect(fired).toBe(true);
  });

  it('renders the EN letter overlay when the active language is en', () => {
    TestBed.resetTestingModule();
    // jsdom does not implement HTMLDialogElement.showModal; stub it so the
    // dialog effect doesn't throw.
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useValue: { lang: () => 'en' as const, t: (key: string) => key },
        },
      ],
      imports: [ProjectDialog],
    });
    const fx = TestBed.createComponent(ProjectDialog);
    fx.componentRef.setInput('project', PROJECTS[0]);
    fx.detectChanges();
    const root = fx.nativeElement as HTMLElement;

    const enParagraph = PROJECTS[0].localized?.en?.letter?.paragraphs?.[0];
    expect(enParagraph).toBeTruthy();
    expect(root.textContent).toContain(enParagraph);
    // Spanish-only paragraph should not leak into the EN render
    const project = PROJECTS[0];
    expect(project.kind).toBe('work');
    const esOnly = project.kind === 'work' ? project.letter?.paragraphs?.[0] : undefined;
    expect(esOnly).toBeTruthy();
    expect(root.textContent).not.toContain(esOnly);
  });

  it('does not render the highlights section in the dialog', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          useValue: { lang: () => 'es' as const, t: (key: string) => key },
        },
      ],
      imports: [ProjectDialog],
    });
    const fx = TestBed.createComponent(ProjectDialog);
    fx.componentRef.setInput('project', PROJECTS[0]);
    fx.detectChanges();
    const root = fx.nativeElement as HTMLElement;

    // Highlights section was reverted (internal review only); the label
    // and its bullets must not appear in the rendered dialog.
    expect(root.textContent).not.toContain('Lo que cambió');
    expect(root.querySelector('section.rounded-lg')).toBeNull();
  });
});
