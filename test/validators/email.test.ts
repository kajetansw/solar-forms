import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

describe('"email" validator', () => {
  it('should return "null" if form control value is a valid email', () => {
    const formControl = getFormControlWithValue('test@test.com');

    expect(V.email(formControl)).toBe(null);
  });

  it('should return error if form control value is an invalid email', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.email(formControl);

    expect(output?.email).toBeTruthy();
  });

  it('should return error if form control value is not "string"', () => {
    const formControl = getFormControlWithValue(Math.random());
    const output = V.email(formControl);

    expect(output?.email).toBeTruthy();
  });
});
