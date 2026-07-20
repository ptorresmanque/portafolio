export interface Letter {
  readonly paragraphs: readonly string[];
  readonly signer: {
    readonly name: string;
    readonly role: string;
    readonly company: string;
  };
}

export interface ProjectLocalization {
  readonly imageAlt?: string;
  readonly shortDescription?: string;
  readonly body?: string;
  readonly letter?: {
    readonly paragraphs: readonly string[];
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
  readonly localized?: {
    readonly en?: ProjectLocalization;
  };
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