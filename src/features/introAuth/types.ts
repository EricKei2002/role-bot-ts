export type ValidateResult = {
  ok: boolean;
  errors: string[];
  reason?: "NOT_TEMPLATE" | "MIN_CHARS" | "NG";
  missingFields?: string[];
};
