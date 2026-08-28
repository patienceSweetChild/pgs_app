export const GUARDIAN_RELATIONSHIP_LABELS = [
  "Parent",
  "Mother",
  "Father",
  "Guardian",
  "Other",
] as const;

export type GuardianRelationshipLabel = (typeof GUARDIAN_RELATIONSHIP_LABELS)[number];

export type GuardianRelationshipRow = {
  id: string;
  student_id: string;
  guardian_email: string;
  relationship_label: string;
  status: string;
  created_at?: string;
};
