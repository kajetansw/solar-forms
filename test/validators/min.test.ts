import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

describe('"min" validator', () => {
  it('should return "null" if form control value is bigger than minimum from validator', () => {
    const formControl = getFormControlWithValue(10);

    expect(V.min(0)(formControl)).toBe(null);
  });

  it('should return "null" if form control value is equal to minimum from validator', () => {
    const formControl = getFormControlWithValue(0);

    expect(V.min(0)(formControl)).toBe(null);
  });

  it('should return error if form control value is lower than minimum from validator', () => {
    const formControl = getFormControlWithValue(-10);
    const output = V.min(0)(formControl);

    expect(output?.min).toBeTruthy();
  });

  it('should return "null" if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.min(0)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "string"', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.min(0)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "boolean"', () => {
    const formControl = getFormControlWithValue(true);
    const output = V.min(0)(formControl);

    expect(output).toBe(null);
  });
});
