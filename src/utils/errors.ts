export class FormControlInvalidKeyError extends Error {
  constructor(formControlName: string) {
    super(`"${formControlName}" form control name does not match any key from the form group.`);
  }
}

type InputType = 'text' | 'checkbox' | 'number';

export class FormControlInvalidTypeError extends Error {
  constructor(formControlName: string, expectedType: InputType, actualValue: unknown) {
    super(
      `"${formControlName}" form control is expected to be of type [${expectedType}] but the value was of type <${typeof actualValue}>.`
    );
  }
}
