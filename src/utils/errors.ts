import { InputType } from './input-element.utils';

export class FormControlInvalidKeyError extends Error {
  constructor(formControlName: string) {
    super(`"${formControlName}" form control name does not match any key from the form group.`);
  }
}

export class FormControlInvalidTypeError extends Error {
  constructor(formControlName: string, expectedInputType: InputType, actualValue: unknown) {
    super(
      `"${formControlName}" form control is expected to be of type [${expectedInputType}] but the value was of type <${typeof actualValue}>.`
    );
  }
}
