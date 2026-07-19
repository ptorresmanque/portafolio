export type JsonLd = Record<string, unknown>;

export interface MetaPayload {
  readonly title: string;
  readonly description: string;
  readonly ogImage?: string;
  readonly url?: string;
}
