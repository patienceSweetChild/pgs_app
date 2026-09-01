export type AiAnswer = {
  facts: string[];
  summary: string;
  suggested_next_step?: string;
  sources: Array<{ label: string; href: string }>;
};
