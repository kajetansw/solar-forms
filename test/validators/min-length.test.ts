import { Validators as V } from '../../src';
import { getFormControlWithValue } from './common';

describe('"minLength" validator', () => {
  it('should return "null" if form control value length is bigger than minimum from validator', () => {
    const formControl = getFormControlWithValue('test');

    expect(V.minLength(1)(formControl)).toBe(null);
  });

  it('should return "null" if form control value length is equal to minimum from validator', () => {
    const formControl = getFormControlWithValue('test');

    expect(V.minLength(4)(formControl)).toBe(null);
  });

  it('should return error if form control value length is lower than minimum from validator', () => {
    const formControl = getFormControlWithValue('test');
    const output = V.minLength(10)(formControl);

    expect(output?.minLength).toBeTruthy();
  });

  it('should return "null" if form control value is "null"', () => {
    const formControl = getFormControlWithValue(null);
    const output = V.minLength(0)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "number"', () => {
    const formControl = getFormControlWithValue(10);
    const output = V.minLength(2)(formControl);

    expect(output).toBe(null);
  });

  it('should return "null" if type of form control value is "boolean"', () => {
    const formControl = getFormControlWithValue(true);
    const output = V.minLength(0)(formControl);

    expect(output).toBe(null);
  });
});
