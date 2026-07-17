export interface Letter {
  readonly paragraphs: readonly string[];
  readonly signer: {
    readonly name: string;
    readonly role: string;
    readonly company: string;
  };
}

export interface BaseProject {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly year: string;
  readonly role: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly shortDescription: string;
  readonly technologies: readonly string[];
  readonly body: string;
}

export interface WorkProject extends BaseProject {
  readonly kind: 'work';
  readonly letter?: Letter;
}

export interface PersonalProject extends BaseProject {
  readonly kind: 'personal';
  readonly githubUrl: string;
  readonly siteUrl?: string;
}

export type Project = WorkProject | PersonalProject;