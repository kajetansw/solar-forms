import { InputValueType } from '../core/form-group-directive/utils/get-input-value-type';

export class FormControlInvalidKeyError extends Error {
  constructor(formControlName: string) {
    super(`"${formControlName}" form control name does not match any key from the form group.`);
  }
}

export class FormControlInvalidTypeError extends Error {
  constructor(
    formControlName: string,
    expectedInputType: InputValueType | InputValueType[],
    actualValue: unknown
  ) {
    const expected =
      typeof expectedInputType === 'string'
        ? `[${expectedInputType}]`
        : expectedInputType.map((t) => `[${t}]`).join(' or ');
    super(
      `Value of the "${formControlName}" form control is expected to be of type ${expected} but the type was [${typeof actualValue}].`
    );
  }
}
