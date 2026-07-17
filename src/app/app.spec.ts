import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { PROJECTS } from './data/projects';

describe('App', () => {
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the 4 project placeholders', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.projects.length).toBe(4);
    expect(fixture.componentInstance.projects.map((p) => p.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
      'cualautocompro-cl',
    ]);
  });

  it('classifies projects correctly by kind', () => {
    const workProjects = PROJECTS.filter((p) => p.kind === 'work');
    const personalProjects = PROJECTS.filter((p) => p.kind === 'personal');

    expect(workProjects.map((p) => p.id)).toEqual([
      'telemetria-2-0',
      'backstops',
      'comunidad-madrid',
    ]);
    expect(personalProjects.map((p) => p.id)).toEqual(['cualautocompro-cl']);

    const cualauto = personalProjects[0];
    if (cualauto.kind === 'personal') {
      expect(cualauto.githubUrl).toBe('https://github.com/ptorresmanque/CualAutoCompro');
      expect(cualauto.siteUrl).toBe('https://cualautocompro.cl');
    }
  });

  it('starts with no dialog project and toggles on openDialog/closeDialog', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.dialogProject()).toBeNull();

    const target = PROJECTS[0];
    app.openDialog(target);
    expect(app.dialogProject()).toBe(target);

    app.closeDialog();
    expect(app.dialogProject()).toBeNull();
  });
});
