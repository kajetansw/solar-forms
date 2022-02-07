export class FormGroupInvalidKeyError extends Error {
  constructor(formControlName: string) {
    super(`${formControlName} is not a part of the form group.`);
  }
}
