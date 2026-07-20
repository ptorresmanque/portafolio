import { Project, ProjectLocalization, WorkProject } from '../models/project';

export function applyLocalization(project: Project, overlay: ProjectLocalization | undefined): Project {
  if (!overlay) return project;
  if (project.kind === 'work') {
    const work = project as WorkProject;
    return {
      ...work,
      imageAlt: overlay.imageAlt ?? work.imageAlt,
      shortDescription: overlay.shortDescription ?? work.shortDescription,
      body: overlay.body ?? work.body,
      ...(work.letter && overlay.letter
        ? { letter: { ...work.letter, paragraphs: overlay.letter.paragraphs } }
        : {}),
    };
  }
  return {
    ...project,
    imageAlt: overlay.imageAlt ?? project.imageAlt,
    shortDescription: overlay.shortDescription ?? project.shortDescription,
    body: overlay.body ?? project.body,
  };
}