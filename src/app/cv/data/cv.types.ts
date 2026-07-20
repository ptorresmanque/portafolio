export interface CvContact {
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

export interface CvExperience {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly bullets: readonly string[];
  readonly stack?: readonly string[];
}

export interface CvEducation {
  readonly degree: string;
  readonly note?: string;
}

export interface CvSkillsBlock {
  readonly category: string;
  readonly items: readonly string[];
}

export interface CvLanguage {
  readonly name: string;
  readonly level: string;
}

export interface CvData {
  readonly header: {
    readonly name: string;
    readonly contact: readonly CvContact[];
  };
  readonly summary: string;
  readonly experience: readonly CvExperience[];
  readonly education: readonly CvEducation[];
  readonly skills: readonly CvSkillsBlock[];
  readonly languages: readonly CvLanguage[];
  readonly referencesNote: string;
}
