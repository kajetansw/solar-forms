import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

describe('"max" validator', () => {
  it('should return "null" if form control value is lower than maximum from validator', () => {
    const formControl = getFormControlWithValue(-10);

    expect(V.max(0)(formControl)).toBe(null);
  });

  it('should return "null" if form control value is equal to maximum from validator', () => {
    const formControl = getFormControlWithValue(0);

    expect(V.max(0)(formControl)).toBe(null);
  });

  it('should return error if form control value is bigger than maximum from validator', () => {
    const formControl = getFormControlWithValue(10);
    const output = V.max(0)(formControl);

    expect(output?.max).toBeTruthy();
  });

  it('should return "null" if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.max(0)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "string"', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.max(0)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "boolean"', () => {
    const formControl = getFormControlWithValue(true);
    const output = V.max(0)(formControl);

    expect(output).toBe(null);
  });
});
