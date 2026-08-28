export const MAX_ACTIVE_STUDENT_ALERTS = 3;
export const MAX_STUDENT_ALERT_WORDS = 12;

export const ALERT_WORD_LIMIT_MESSAGE =
  "An important alert can have at most 12 words.";
export const ALERT_ACTIVE_LIMIT_MESSAGE =
  "A student can have at most 3 active important alerts.";

export function studentAlertWordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function assertStudentAlertText(value: unknown): string {
  if (typeof value !== "string") throw new Error("Enter a valid value.");
  const result = value.trim().replace(/\s+/g, " ");
  if (!result || result.length > 1000) throw new Error("Enter a valid value.");
  if (studentAlertWordCount(result) > MAX_STUDENT_ALERT_WORDS) {
    throw new Error(ALERT_WORD_LIMIT_MESSAGE);
  }
  return result;
}

export function studentOperationsMutationError(
  error: { message?: string; details?: string } | null | undefined,
): { message: string; status: number } | null {
  const text = `${error?.message ?? ""} ${error?.details ?? ""}`;
  if (text.includes(ALERT_WORD_LIMIT_MESSAGE)) {
    return { message: ALERT_WORD_LIMIT_MESSAGE, status: 422 };
  }
  if (text.includes(ALERT_ACTIVE_LIMIT_MESSAGE)) {
    return { message: ALERT_ACTIVE_LIMIT_MESSAGE, status: 422 };
  }
  return null;
}

export function canonicalBoardColumnOrder(key: string): number {
  const order = ["journey_map", "in_progress", "draft_phase", "completed"];
  const index = order.indexOf(key);
  return index < 0 ? 99 : index;
}
