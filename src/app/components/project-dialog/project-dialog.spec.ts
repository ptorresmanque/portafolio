import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';
import { ProjectDialog } from './project-dialog';
import { PROJECTS } from '../../data/projects';

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
});