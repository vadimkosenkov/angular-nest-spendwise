import { AbstractControl } from "@angular/forms";

interface ValidationRule {
  error: string;
  message: string;
}

export function getFieldErrorMessage(
  control: AbstractControl | null,
  rules: ValidationRule[]
): string {
  if (!control || control.valid || control.untouched) {
    return "";
  }

  for (const rule of rules) {
    if (control.hasError(rule.error)) {
      return rule.message;
    }
  }

  return "";
}
